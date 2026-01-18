import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import nodemailer from "nodemailer";
import { passwordChangedByAdminEmail } from "@/lib/email-templates";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-pulse.com",
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// PUT - Admin resets user password (no current password required)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Strict check: Only Super Admin (garikaib@gmail.com or username 'garikaib')
        const isSuperAdmin = session?.user?.email === "garikaib@gmail.com" || session?.user?.name === "garikaib";

        if (!session || !isSuperAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { newPassword } = body;

        // Enhanced Password Complexity Check
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

        if (!newPassword || !complexityRegex.test(newPassword)) {
            return NextResponse.json({
                error: "Password must be at least 10 characters and include uppercase, lowercase, number, and special character."
            }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        // Send notification email
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"Crystal Cred Website" <info@crystalcred.co.zw>',
                to: user.email,
                subject: "Security Alert: Password Changed",
                html: passwordChangedByAdminEmail(user.username),
            })
        } catch (emailError) {
            console.error("Failed to send password change email:", emailError)
            // Continue execution, don't fail the request just because email failed
        }

        return NextResponse.json({
            success: true,
            message: `Password reset successfully for ${user.username}`,
        });

    } catch (error) {
        console.error("[ADMIN_PASSWORD_RESET_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
