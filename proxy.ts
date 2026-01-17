import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Admin route protection
    // Check if accessing admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        // Check for session cookie (authjs.session-token or __Secure-authjs.session-token)
        const sessionCookie =
            request.cookies.get("authjs.session-token") ||
            request.cookies.get("__Secure-authjs.session-token") ||
            request.cookies.get("next-auth.session-token") ||
            request.cookies.get("__Secure-next-auth.session-token")

        if (!sessionCookie) {
            // No session, redirect to login
            const loginUrl = new URL("/admin/login", request.url)
            return NextResponse.redirect(loginUrl)
        }
        // Note: We can't verify the token content in Edge runtime without crypto,
        // so we rely on the server-side auth() check in the layout for role verification
    }

    // Get the response
    const response = NextResponse.next()

    // Security Headers
    const headers = response.headers

    // Prevent clickjacking
    headers.set("X-Frame-Options", "DENY")

    // Prevent MIME type sniffing
    headers.set("X-Content-Type-Options", "nosniff")

    // Enable XSS filter
    headers.set("X-XSS-Protection", "1; mode=block")

    // Control referrer information
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    // Permissions Policy (formerly Feature Policy)
    headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    )

    // Content Security Policy
    // Note: This is a relatively permissive CSP for development
    // Tighten for production as needed
    headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://*.googleusercontent.com",
            "connect-src 'self' https://challenges.cloudflare.com",
            "frame-src https://challenges.cloudflare.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ].join("; ")
    )

    // Strict Transport Security (only applies when site is served over HTTPS)
    if (process.env.NODE_ENV === "production") {
        headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload"
        )
    }

    return response
}

// Apply middleware to all routes except static files and api routes that need different handling
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
