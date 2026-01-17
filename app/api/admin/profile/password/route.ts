
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        if (newPassword.length < 6) {
            return new NextResponse("Password must be at least 6 characters", { status: 400 });
        }

        await dbConnect();

        // 1. Fetch user with password field explicitly selected
        // Using +password because select: false is likely set on schema
        const user = await User.findOne({ email: session.user.email }).select("+password");

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // 2. Verify current password
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return new NextResponse("Incorrect current password", { status: 400 });
        }

        // 3. Update password
        user.password = newPassword;
        await user.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[PASSWORD_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
