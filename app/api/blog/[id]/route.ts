import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect()
    try {
        const { id } = await params
        const post = await BlogPost.findById(id)
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    try {
        const { id } = await params
        const data = await req.json()
        const post = await BlogPost.findByIdAndUpdate(id, data, { new: true })
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    try {
        const { id } = await params
        const post = await BlogPost.findByIdAndDelete(id)
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Post deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }
}
