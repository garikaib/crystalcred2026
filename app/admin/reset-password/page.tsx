"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Lock, CheckCircle, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!token) {
            setError("Invalid or missing reset token")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password")
            }

            setIsSuccess(true)
            setTimeout(() => {
                router.push("/admin/login")
            }, 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold">Invalid Link</h2>
                <p className="text-gray-500">This password reset link is invalid or has expired.</p>
                <Button asChild className="w-full" variant="outline">
                    <Link href="/admin/login">Return to Login</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reset Password</h1>
                <p className="text-sm text-gray-500">
                    Create a new secure password for your account.
                </p>
            </div>

            {isSuccess ? (
                <div className="text-center space-y-6 animate-in fade-in-50">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Password Reset!</h3>
                        <p className="text-sm text-gray-500">
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/admin/login">
                            Go to Login
                        </Link>
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#0d9488] hover:bg-[#0f766e]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                            </>
                        ) : (
                            "Set New Password"
                        )}
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/admin/login"
                            className="text-sm text-gray-500 hover:text-[#0d9488] transition-colors inline-flex items-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
