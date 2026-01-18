import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

// GET - Fetch current user's profile
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).select("username email role createdAt");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user._id,
            username: user.username,
            email: user.email,
            name: session.user.name, // From session/JWT
            role: user.role,
            createdAt: user.createdAt,
        });

    } catch (error) {
        console.error("[PROFILE_GET_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT - Update current user's profile (username only)
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { username } = body;

        if (!username || username.length < 3) {
            return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
        }

        // Sanitize username
        const sanitizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

        await dbConnect();

        // Check if username is taken by another user
        const existingUser = await User.findOne({
            username: sanitizedUsername,
            email: { $ne: session.user.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { username: sanitizedUsername },
            { new: true }
        ).select("username email role");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            username: user.username,
        });

    } catch (error) {
        console.error("[PROFILE_UPDATE_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
