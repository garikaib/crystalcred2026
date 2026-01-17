import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import ActivityLog from "@/models/ActivityLog"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(20)

        // Enhance logs with user-friendly descriptions or formatting if needed
        return NextResponse.json(logs)
    } catch (error) {
        console.error("Error fetching activity logs:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
