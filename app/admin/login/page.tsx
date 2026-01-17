"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Shield, ArrowRight, Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react"
import Script from "next/script"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [magicEmail, setMagicEmail] = useState("")
    const [isMagicLink, setIsMagicLink] = useState(false)
    const [magicLinkSent, setMagicLinkSent] = useState(false)
    const [turnstileToken, setTurnstileToken] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const turnstileRef = useRef<HTMLDivElement>(null)

    const errorFromUrl = searchParams.get("error")

    useEffect(() => {
        if (errorFromUrl) {
            if (errorFromUrl === "CredentialsSignin") {
                setError("Invalid username or password")
            } else if (errorFromUrl === "MissingCSRF") {
                setError("Security verification failed. Please try again or clear your browser cookies.")
            } else {
                setError(errorFromUrl)
            }
        }
    }, [errorFromUrl])

    // Turnstile callback
    useEffect(() => {
        (window as any).onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token)
        };
        (window as any).onTurnstileExpired = () => {
            setTurnstileToken("")
        };
        (window as any).onTurnstileError = () => {
            setError("Security verification failed. Please refresh.")
        }
    }, [])

    async function handleMagicLinkSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!turnstileToken) {
            setError("Please complete the security verification")
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/magic-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: magicEmail }),
            })

            if (!res.ok) throw new Error("Failed to send magic link")

            setMagicLinkSent(true)
        } catch (err) {
            setError("Failed to send magic link. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!turnstileToken) {
            setError("Please complete the security verification")
            setIsLoading(false)
            return
        }

        try {
            const result = await signIn("credentials", {
                username,
                password,
                turnstileToken,
                redirect: false,
            })

            if (result?.error) {
                setError(result.error === "CredentialsSignin" ? "Invalid username or password" : result.error)
                // Reset Turnstile
                if ((window as any).turnstile) {
                    (window as any).turnstile.reset()
                }
                setTurnstileToken("")
            } else if (result?.ok) {
                router.push("/admin")
                router.refresh()
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                async
                defer
            />
            <div className="min-h-screen flex">
                {/* Left Panel - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 flex-col justify-between p-12 text-white">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">CrystalCred</h1>
                        <p className="text-slate-400">Admin Portal</p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Manage Your Content</h3>
                                <p className="text-slate-400 text-sm">Create and publish blog posts, manage products, and update your gallery.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Secure Access</h3>
                                <p className="text-slate-400 text-sm">Protected with secure credentials and bot protection.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} CrystalCred. All rights reserved.
                    </p>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:hidden mb-8">
                            <h1 className="text-3xl font-bold text-slate-900">CrystalCred</h1>
                            <p className="text-gray-500">Admin Portal</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-500 mb-8">Sign in to access the admin dashboard</p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                                    <AlertCircle size={20} />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <form onSubmit={isMagicLink ? handleMagicLinkSubmit : handleSubmit} className="space-y-6">
                                {magicLinkSent ? (
                                    <div className="text-center space-y-4 animate-in fade-in-50">
                                        <div className="flex justify-center">
                                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle className="h-8 w-8 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-medium">Check your email</h3>
                                            <p className="text-sm text-gray-500">
                                                We've sent a magic link to <strong>{magicEmail}</strong>.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setMagicLinkSent(false)
                                                setIsMagicLink(false)
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {isMagicLink ? (
                                            <div className="space-y-2">
                                                <Label htmlFor="magicEmail">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="magicEmail"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        className="pl-10 h-12"
                                                        value={magicEmail}
                                                        onChange={(e) => setMagicEmail(e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="username">Username or Email</Label>
                                                    <Input
                                                        id="username"
                                                        type="text"
                                                        placeholder="Enter your username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                        className="h-12"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password">Password</Label>
                                                        <Link
                                                            href="/admin/forgot-password"
                                                            className="text-sm text-primary hover:underline text-[#0d9488]"
                                                        >
                                                            Forgot password?
                                                        </Link>
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                        className="h-12"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Turnstile Widget */}
                                        <div
                                            ref={turnstileRef}
                                            className="cf-turnstile"
                                            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACM4BbF045-Zf1Cw"}
                                            data-callback="onTurnstileSuccess"
                                            data-expired-callback="onTurnstileExpired"
                                            data-error-callback="onTurnstileError"
                                            data-theme="light"
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-base bg-[#0d9488] hover:bg-[#0f766e]"
                                            size="lg"
                                            disabled={isLoading || !turnstileToken}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    {isMagicLink ? "Sending..." : "Signing in..."}
                                                </>
                                            ) : (
                                                <>
                                                    {isMagicLink ? "Send Magic Link" : "Sign In"}
                                                    <ArrowRight className="ml-auto h-5 w-5" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-muted-foreground text-gray-400">
                                                    Or continue with
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-12"
                                            onClick={() => setIsMagicLink(!isMagicLink)}
                                            disabled={isLoading}
                                        >
                                            {isMagicLink ? "Sign in with Password" : "Sign in with Magic Link"}
                                        </Button>
                                    </>
                                )}
                            </form>

                            <p className="text-xs text-center text-gray-400 mt-6">
                                Only authorized administrators can access this portal.
                            </p>
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Not an admin? <a href="/" className="text-primary hover:underline">Return to website</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
