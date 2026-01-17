import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"
import crypto from "crypto"

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
        }

        await dbConnect()

        // Hash the token to compare with DB
        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")

        // Find user with valid token and expiry
        const user = await User.findOne({
            resetToken: resetTokenHash,
            resetTokenExpiry: { $gt: Date.now() },
        }).select("+resetToken +resetTokenExpiry")

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
        }

        // Update password and clear token
        user.password = password
        user.resetToken = undefined
        user.resetTokenExpiry = undefined

        await user.save()

        return NextResponse.json({ message: "Password has been reset successfully" })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
