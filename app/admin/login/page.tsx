import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Zap, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-crystal-dark to-crystal-navy flex-col justify-between p-12 text-white">
                <div>
                    <h1 className="text-4xl font-bold mb-2">CrystalCred</h1>
                    <p className="text-crystal-light/70">Admin Portal</p>
                </div>

                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Manage Your Content</h3>
                            <p className="text-crystal-light/70 text-sm">Create and publish blog posts with ease using our rich text editor.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Secure Access</h3>
                            <p className="text-crystal-light/70 text-sm">Protected with Google Sign-In and admin-only authorization.</p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-crystal-light/50">
                    © {new Date().getFullYear()} CrystalCred. All rights reserved.
                </p>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden mb-8">
                        <h1 className="text-3xl font-bold text-crystal-navy">CrystalCred</h1>
                        <p className="text-gray-500">Admin Portal</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 mb-8">Sign in to access the admin dashboard</p>

                        <form
                            action={async () => {
                                "use server"
                                await signIn("google", { redirectTo: "/admin" })
                            }}
                        >
                            <Button type="submit" className="w-full h-12 text-base" size="lg">
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                                <ArrowRight className="ml-auto h-5 w-5" />
                            </Button>
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
    )
}
