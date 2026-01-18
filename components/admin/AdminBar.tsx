"use client"

import { useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { LayoutDashboard, LogOut, FileText, Image as ImageIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminBar() {
    const { data: session, status } = useSession()
    const isAdmin = status === "authenticated" && session?.user?.role === "admin"

    useEffect(() => {
        if (isAdmin) {
            document.body.classList.add("has-admin-bar")
        } else {
            document.body.classList.remove("has-admin-bar")
        }
        return () => document.body.classList.remove("has-admin-bar")
    }, [isAdmin])

    if (!isAdmin) {
        return null
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-gray-800 text-white h-8 text-xs flex items-center justify-between px-4 shadow-md overflow-hidden">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-1 hover:text-green-400 transition-colors font-semibold">
                    <LayoutDashboard size={14} /> Admin
                </Link>
                <Link href="/admin/blog" className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <FileText size={14} /> Blog
                </Link>
                <Link href="/admin/media" className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <ImageIcon size={14} /> Media
                </Link>
                <Link href="/admin/gallery" className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <ImageIcon size={14} /> Gallery
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-300 hidden sm:flex items-center gap-1">
                    <User size={14} /> {session.user?.name || session.user?.email}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-red-400 hover:text-red-300 hover:bg-gray-700 px-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut size={14} className="mr-1" /> Logout
                </Button>
            </div>
        </div>
    )
}
