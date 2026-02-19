import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyRefreshToken, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("refresh_token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyRefreshToken(token);
        if (!payload || typeof payload.userId !== 'string') {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { id: payload.userId }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isValid = await comparePassword(currentPassword, user.password);

        if (!isValid) {
            return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await db.user.update({
            where: { id: payload.userId },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Password Change Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
