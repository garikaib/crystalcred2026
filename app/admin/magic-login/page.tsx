"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function MagicLoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!token || !email) {
            setStatus("error")
            setErrorMessage("Invalid login link. Please ensure you copied the full URL.")
            return
        }

        const verifyLogin = async () => {
            try {
                const result = await signIn("credentials", {
                    email,
                    magicToken: token,
                    redirect: false,
                })

                if (result?.error) {
                    setStatus("error")
                    setErrorMessage("This magic link has expired or is invalid.")
                } else if (result?.ok) {
                    setStatus("success")
                    // Wait a moment for success animation then redirect
                    setTimeout(() => {
                        router.push("/admin/blog")
                    }, 1500)
                }
            } catch (error) {
                setStatus("error")
                setErrorMessage("An unexpected error occurred during sign in.")
            }
        }

        verifyLogin()
    }, [token, email, router])

    if (status === "verifying") {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#0d9488]" />
                <h2 className="text-xl font-semibold text-gray-900">Verifying your link...</h2>
                <p className="text-gray-500">Please wait while we log you in.</p>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in-50">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Success!</h2>
                <p className="text-gray-500">Redirecting to your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Login Failed</h2>
            <p className="text-red-500 max-w-sm text-center">{errorMessage}</p>
            <Button asChild variant="outline" className="mt-4">
                <Link href="/admin/login">Back to Login</Link>
            </Button>
        </div>
    )
}

export default function MagicLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">
                <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-gray-400" />}>
                    <MagicLoginContent />
                </Suspense>
            </div>
        </div>
    )
}
