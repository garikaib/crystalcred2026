"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Package,
    MessageSquareQuote,
    Settings,
    LogOut,
    LayoutDashboard,
    Route,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mainNavItems = [
    {
        title: "Blog Posts",
        href: "/admin/blog",
        icon: FileText,
    },
    {
        title: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
    },
    {
        title: "Gallery",
        href: "/admin/gallery",
        icon: ImageIcon,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen border-r border-slate-800 shadow-xl">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">C</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Admin
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
                <div>
                    <div className="mb-6">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20 transition-all duration-200"
                        >
                            <ExternalLink size={18} />
                            Visit Site
                        </Link>
                    </div>

                    <h3 className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-4 px-4">
                        Management
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname === "/admin"
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <LayoutDashboard size={18} className={cn(
                                "transition-colors",
                                pathname === "/admin" ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            Dashboard
                        </Link>
                        {mainNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <Icon size={18} className={cn(
                                        "transition-colors",
                                        isActive ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                                    )} />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-4 px-4">
                        Pages
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="/admin/pages"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname?.startsWith("/admin/pages")
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <FileText size={18} className={cn(
                                "transition-colors",
                                pathname?.startsWith("/admin/pages") ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            All Pages
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-4 px-4">
                        System
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="/admin/settings/contact"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname === "/admin/settings/contact"
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <Settings size={18} className={cn(
                                "transition-colors",
                                pathname === "/admin/settings/contact" ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            Contact Info
                        </Link>
                        <Link
                            href="/admin/settings/socials"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname === "/admin/settings/socials"
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <Settings size={18} className={cn(
                                "transition-colors",
                                pathname === "/admin/settings/socials" ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            Social Media
                        </Link>
                        <Link
                            href="/admin/settings/security"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname === "/admin/settings/security"
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <Settings size={18} className={cn(
                                "transition-colors",
                                pathname === "/admin/settings/security" ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            Security
                        </Link>
                        <Link
                            href="/admin/redirects"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                pathname === "/admin/redirects"
                                    ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <Route size={18} className={cn(
                                "transition-colors",
                                pathname === "/admin/redirects" ? "text-teal-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            Redirects
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <form action="/api/auth/signout" method="POST">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-3"
                        type="submit"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    )
}
