import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth";
import { db } from "@/lib/db";
import StudentLayoutClient from "./student-layout-client";

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh_token")?.value;

    if (!token) return null;

    try {
        const payload = await verifyRefreshToken(token);
        if (!payload || typeof payload.userId !== 'string') return null;

        const user = await db.user.findUnique({
            where: { id: payload.userId },
            select: { name: true, email: true }
        });

        return user;
    } catch (e) {
        return null;
    }
}

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    return (
        <StudentLayoutClient user={user}>
            {children}
        </StudentLayoutClient>
    );
}

