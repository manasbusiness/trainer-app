import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: "No refresh token found" }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    // Issue new access token
    const accessToken = await signAccessToken({ userId: payload.userId, role: payload.role });

    return NextResponse.json({ accessToken }, { status: 200 });
}
