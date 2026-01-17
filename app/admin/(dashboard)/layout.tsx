import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Session is guaranteed by middleware, but we still fetch it for user data
    const session = await auth()

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
