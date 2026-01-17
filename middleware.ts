import { auth } from "@/lib/auth"

export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // Skip middleware for non-admin routes
    if (!isAdminRoute) return

    // Allow access to login page without auth
    if (isLoginPage) return

    // Redirect to login if not authenticated or not admin
    if (!req.auth || (req.auth.user as any)?.role !== "admin") {
        const loginUrl = new URL("/admin/login", req.nextUrl.origin)
        return Response.redirect(loginUrl)
    }
})

export const config = {
    matcher: ["/admin/:path*"],
}
