import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { magicLinkEmail } from "@/lib/email-templates"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-pulse.com",
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        await dbConnect()

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            // Return success to prevent enumeration
            return NextResponse.json({ message: "If an account exists, a magic link has been sent." })
        }

        // Generate magic token
        const magicToken = crypto.randomBytes(32).toString("hex")
        const magicTokenHash = crypto.createHash("sha256").update(magicToken).digest("hex")

        // Save hashed token to DB
        user.magicLinkToken = magicTokenHash
        user.magicLinkExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        await user.save()

        // Create magic URL - Pointing to a special login handler page
        const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
        const magicUrl = `${origin}/admin/magic-login?token=${magicToken}&email=${encodeURIComponent(user.email)}`

        // Send email
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Crystal Cred Website" <info@crystalcred.co.zw>',
            to: user.email,
            subject: "Sign in to CrystalCred",
            html: magicLinkEmail(magicUrl, "Crystal Cred Website"),
        })

        return NextResponse.json({ message: "If an account exists, a magic link has been sent." })
    } catch (error) {
        console.error("Magic link error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
