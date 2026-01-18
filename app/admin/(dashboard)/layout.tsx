import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    let session = null
    try {
        session = await auth()
    } catch (error) {
        console.error("Auth error in AdminLayout:", error)
    }

    // If no session or not admin role, redirect to login
    if (!session || (session.user as any)?.role !== "admin") {
        redirect("/admin/login")
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <AdminHeader />

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in-50 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
