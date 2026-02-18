import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate tokens
        const accessToken = await signAccessToken({ userId: user.id, role: user.role });
        const refreshToken = await signRefreshToken({ userId: user.id, role: user.role });

        const response = NextResponse.json(
            {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                accessToken,
                message: "Login successful",
            },
            { status: 200 }
        );

        // Set Refresh Token as HTTP Only Cookie
        response.cookies.set({
            name: "refresh_token",
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid input",
                    errors: error.issues.map((err) => ({
                        field: err.path[0],
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
