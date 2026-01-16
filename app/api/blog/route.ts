import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(req: NextRequest) {
    await dbConnect()
    try {
        // Allow public to fetch published, or admin to fetch all if needed?
        // For simplicity, this endpoint returns all for admin table, filtered for public via query
        const url = new URL(req.url)
        const status = url.searchParams.get("status")

        const query = status ? { status } : {}
        const posts = await BlogPost.find(query).sort({ createdAt: -1 })
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    try {
        const data = await req.json()
        // Generate slug from title if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        }

        data.author = session.user.name || "CrystalCred Admin"

        const post = await BlogPost.create(data)
        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }
}
