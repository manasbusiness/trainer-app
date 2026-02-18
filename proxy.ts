import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-change-me"
);

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Check if public route
    const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))) {
        return NextResponse.next();
    }

    // 2. Check for access token in header (Client side request) or cookie (Server side / browser navigation)
    // For browser navigation, we rely on cookies or maybe we need to store access token in cookie too?
    // The plan said "Access Token + Refresh Token". Access token usually in header for API calls.
    // But for page navigation (e.g. /student/dashboard), the browser sends cookies.
    // We can't easily put bearer token in page navigation headers.
    // To protect pages via middleware, we might need access token in cookie OR verify refresh token in cookie.
    // Let's assume we store Access Token in a non-httpOnly cookie for Middleware to read, OR we execute refresh flow logic in middleware.
    // Or simpler: put access token in httpOnly cookie as well but short lived.
    // However, user asked for "Access token + Refresh token".
    // Let's adhere to standard: Access Token (In-memory/JS) & Refresh Token (Cookie).
    // Problem: Middleware runs on server before page load. It can only see cookies. It cannot see Redux/Zustand store.
    // If we want Middleware to protect pages, we MUST have a token in cookies.
    // Common pattern: Refresh Token in httpOnly cookie. Access Token in memory.
    // BUT middleware cannot protect pages with just Access Token if it's in memory.
    // Solution: We will rely on Client Components to redirect if no access token, OR we use the Refresh token in cookie to validate session in middleware.
    // Let's use the Refresh token to validate session for page loads. 
    // If refresh token is valid, we allow access. If invalid, redirect to login.
    // Note: This is slightly looser than validating Access Token on every request, but good enough for page navigation.

    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (refreshToken) {
        // If trying to access login page while logged in, redirect to dashboard
        if (pathname === "/login" || pathname === "/register") {
            // We need to decode to know role.
            try {
                const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me"));
                const role = payload.role as string;
                if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
                if (role === "STUDENT") return NextResponse.redirect(new URL("/student/dashboard", req.url));
            } catch (e) {
                // token invalid, proceed to login page
            }
        }

        // Validating protected routes
        try {
            const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me"));
            const role = payload.role as string;

            if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
                return NextResponse.redirect(new URL("/student/dashboard", req.url)); // Unauthorized
            }
            if (pathname.startsWith("/student") && role !== "STUDENT") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url)); // Unauthorized
            }

        } catch (error) {
            // Token invalid
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
