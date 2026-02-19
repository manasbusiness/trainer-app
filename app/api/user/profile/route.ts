import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth";

export async function GET() {
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

        const user = await db.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                phoneNumber: true,
                address: true,
                role: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
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
        const { bio, phoneNumber, address, name } = body;

        const updatedUser = await db.user.update({
            where: { id: payload.userId },
            data: {
                name,
                bio,
                phoneNumber,
                address
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                phoneNumber: true,
                address: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message || String(error) }, { status: 500 });
    }
}
