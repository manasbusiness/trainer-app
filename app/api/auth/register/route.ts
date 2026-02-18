import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["SUPER_ADMIN", "STUDENT"]).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = registerSchema.parse(body);

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STUDENT",
            },
        });

        // Don't return password
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { user: userWithoutPassword, message: "User created successfully" },
            { status: 201 }
        );
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
