import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Notice from "@/models/Notice"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 })
        return NextResponse.json(notices)
    } catch (error) {
        console.error("Error fetching notices:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()
        const notice = await Notice.create(body)

        return NextResponse.json(notice, { status: 201 })
    } catch (error) {
        console.error("Error creating notice:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
