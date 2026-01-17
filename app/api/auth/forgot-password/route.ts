import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { resetPasswordEmail } from "@/lib/email-templates"

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
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: "If an account exists, a reset email has been sent." })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

        // Save hashed token to DB
        user.resetToken = resetTokenHash
        user.resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
        await user.save()

        // Create reset URL
        // We use the origin from the request or fallback to localhost
        const origin = request.nextUrl.origin
        const resetUrl = `${origin}/admin/reset-password?token=${resetToken}`

        // Send email
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Crystal Cred Website" <info@crystalcred.co.zw>',
            to: user.email,
            subject: "Reset Your Password - CrystalCred",
            html: resetPasswordEmail(resetUrl),
        })

        return NextResponse.json({ message: "If an account exists, a reset email has been sent." })
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
