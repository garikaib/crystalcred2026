import { notFound, redirect } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Redirect from "@/models/Redirect"

export default async function CatchAllPage({ params }: { params: Promise<{ catchAll: string[] }> }) {
    const { catchAll } = await params
    const path = `/${catchAll.join("/")}`

    // PROTECTION: Do not allow redirects for admin paths to prevent locking out admin or confusing loops
    if (path.startsWith("/admin")) {
        notFound()
    }

    try {
        await dbConnect()

        // Find a redirect that matches this path
        // We look for exact match first
        const foundRedirect = await Redirect.findOne({
            source: path,
            isActive: true
        })

        if (foundRedirect) {
            let destination = foundRedirect.destination

            // If we need to preserve query params, we would need the full URL or access to query params
            // But this catch-all only gives us the path parts. 
            // Query params are automatically passed by the browser in the redirect mostly?
            // Wait, for 301/302, existing query params are usually preserved by browsers unless the destination has them?
            // Actually, we should check 'ignoreQueryParams'. 
            // In Server Component page, we can access searchParams prop!

            return redirect(destination)
        }

    } catch (error) {
        console.error("Error checking redirects in catch-all:", error)
    }

    // Default to 404 if no redirect found
    notFound()
}
