import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me";

const key = new TextEncoder().encode(JWT_SECRET);
const refreshKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
    return await bcrypt.compare(plain, hashed);
}

export async function signAccessToken(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m") // Short lived
        .sign(key);
}

export async function signRefreshToken(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Long lived
        .sign(refreshKey);
}

export async function verifyAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function verifyRefreshToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, refreshKey);
        return payload;
    } catch (error) {
        return null;
    }
}

export function getSession() {
    // Helper to get session in server components
    // implementation depends on how we pass token (cookie or header)
    // usually we check cookies
}
