import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { GalleryItem } from "@/models/GalleryItem"

export async function GET() {
    try {
        await dbConnect()
        const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 })
        return NextResponse.json(items)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch gallery items" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const data = await req.json()
        const item = await GalleryItem.create(data)

        return NextResponse.json(item)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create gallery item" },
            { status: 500 }
        )
    }
}
