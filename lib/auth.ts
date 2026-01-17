import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

async function verifyTurnstile(token: string): Promise<boolean> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
        console.error("TURNSTILE_SECRET_KEY is not configured")
        return false
    }

    try {
        const res = await fetch(TURNSTILE_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
        })

        const data = await res.json()
        return data.success === true
    } catch (error) {
        console.error("Turnstile verification failed:", error)
        return false
    }
}

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                turnstileToken: { label: "Turnstile Token", type: "text" },
                magicToken: { label: "Magic Token", type: "text" },
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                // Connect to database
                await dbConnect()

                // 1. Magic Link Logic
                const magicToken = credentials.magicToken as string
                const magicEmail = credentials.email as string

                if (magicToken && magicEmail) {
                    const crypto = require("crypto")
                    const magicTokenHash = crypto.createHash("sha256").update(magicToken).digest("hex")

                    const user = await User.findOne({
                        email: magicEmail.toLowerCase(),
                        magicLinkToken: magicTokenHash,
                        magicLinkExpiry: { $gt: Date.now() },
                    }).select("+magicLinkToken +magicLinkExpiry")

                    if (!user) {
                        throw new Error("Invalid or expired magic link")
                    }

                    // Clear utilized token
                    user.magicLinkToken = undefined
                    user.magicLinkExpiry = undefined
                    await user.save()

                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        role: user.role,
                    }
                }

                // 2. Standard Username/Password Logic
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Please provide username and password")
                }

                // Verify Turnstile
                const turnstileToken = credentials.turnstileToken as string
                if (!turnstileToken) {
                    throw new Error("Security verification required")
                }

                const isTurnstileValid = await verifyTurnstile(turnstileToken)
                if (!isTurnstileValid) {
                    throw new Error("Security verification failed")
                }

                // Find user by username or email
                const username = (credentials.username as string).toLowerCase().trim()
                const user = await User.findOne({
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                })

                if (!user) {
                    throw new Error("Invalid credentials")
                }

                // Compare password
                const isPasswordValid = await user.comparePassword(credentials.password as string)
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials")
                }

                // Return user object
                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: true,
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? `__Secure-authjs.session-token` : `authjs.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        callbackUrl: {
            name: process.env.NODE_ENV === "production" ? `__Secure-authjs.callback-url` : `authjs.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        csrfToken: {
            name: process.env.NODE_ENV === "production" ? `__Secure-authjs.csrf-token` : `authjs.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                session.user.role = token.role as string
                session.user.id = token.sub as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
