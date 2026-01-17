import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { GalleryItem } from "@/models/GalleryItem"

interface RouteProps {
    params: {
        id: string
    }
}

export async function PUT(req: Request, { params }: any) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()
        const data = await req.json()
        const item = await GalleryItem.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        return NextResponse.json(item)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update gallery item" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: any) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()
        const item = await GalleryItem.findByIdAndDelete(id)

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Item deleted successfully" })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete gallery item" },
            { status: 500 }
        )
    }
}
