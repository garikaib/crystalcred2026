import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

// GET - List all users (admin only)
export async function GET() {
    try {
        const session = await auth();
        // Strict check: Only Super Admin (garikaib@gmail.com or username 'garikaib')
        const isSuperAdmin = session?.user?.email === "garikaib@gmail.com" || session?.user?.name === "garikaib";

        if (!session || !isSuperAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const users = await User.find({})
            .select("username email role createdAt")
            .sort({ createdAt: -1 });

        return NextResponse.json(users);

    } catch (error) {
        console.error("[USERS_LIST_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
