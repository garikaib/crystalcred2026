import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { contactAdminEmail, userConfirmationEmail } from "@/lib/email-templates"

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

interface ContactFormData {
    name: string
    email: string
    phone: string
    message: string
    turnstileToken: string
}

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

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-pulse.com",
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json()

        // Validate required fields
        if (!body.name || !body.email || !body.phone || !body.message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Verify Turnstile token
        if (!body.turnstileToken) {
            return NextResponse.json(
                { error: "Security verification required" },
                { status: 400 }
            )
        }

        const isValid = await verifyTurnstile(body.turnstileToken)
        if (!isValid) {
            return NextResponse.json(
                { error: "Security verification failed. Please try again." },
                { status: 403 }
            )
        }

        // Send Admin Notification
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Crystal Cred Website" <info@crystalcred.co.zw>',
            to: "innocent@crystalcred.co.zw",
            subject: `New Contact Form Submission from ${body.name}`,
            text: `
Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone}
Message:
${body.message}
            `,
            html: contactAdminEmail({
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message
            }),
        })

        // Optionally send user confirmation
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"Crystal Cred Website" <info@crystalcred.co.zw>',
                to: body.email,
                subject: "We received your message - CrystalCred",
                text: `Hi ${body.name},\n\nThank you for reaching out to CrystalCred. We have received your message and will get back to you shortly.\n\nBest regards,\nThe CrystalCred Team`,
                html: userConfirmationEmail(body.name),
            })
        } catch (emailError) {
            console.error("Failed to send user confirmation email:", emailError)
            // Non-blocking error
        }

        return NextResponse.json({ success: true, message: "Message sent successfully" })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to process your request" },
            { status: 500 }
        )
    }
}
