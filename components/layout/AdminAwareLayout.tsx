"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AdminBar } from "@/components/admin/AdminBar"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Toaster } from "@/components/ui/toaster"

export function AdminAwareLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminPage = pathname?.startsWith("/admin")

    return (
        <AuthProvider>
            {!isAdminPage && <AdminBar />}
            {!isAdminPage && <Header />}
            <main className={!isAdminPage ? "flex-grow pt-20" : "flex-grow"}>
                {children}
            </main>
            {!isAdminPage && <Footer />}
            <Toaster />
        </AuthProvider>
    )
}
