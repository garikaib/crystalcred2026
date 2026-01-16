import { NextRequest, NextResponse } from "next/server"

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

        // TODO: Here you would typically:
        // 1. Store the contact request in a database
        // 2. Send an email notification
        // 3. Integrate with a CRM

        console.log("Contact form submission:", {
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
            timestamp: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, message: "Message sent successfully" })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to process your request" },
            { status: 500 }
        )
    }
}
