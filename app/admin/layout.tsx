import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"
import { LayoutDashboard, FileText, Settings, LogOut, Image as ImageIcon, Package, MessageSquareQuote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
        redirect("/admin/login")
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                    <p className="text-sm text-gray-500">{session.user.name}</p>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText size={20} /> Blog Posts
                    </Link>
                    <Link href="/admin/media" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <ImageIcon size={20} /> Media Library
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <Package size={20} /> Featured Products
                    </Link>
                    <Link href="/admin/testimonials" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquareQuote size={20} /> Testimonials
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-gray-400 cursor-not-allowed">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" type="submit">
                            <LogOut size={20} className="mr-2" /> Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header (placeholder for now) */}

            {/* Main Content */}
            <main className="flex-grow p-8">
                {children}
            </main>
        </div>
    )
}
