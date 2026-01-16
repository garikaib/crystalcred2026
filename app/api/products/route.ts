
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Product } from "@/models/Product"

export async function GET(req: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const category = searchParams.get("category")
        const featured = searchParams.get("featured")
        const activeOnly = searchParams.get("active") !== "false"

        const query: any = {}
        if (category) query.category = category
        if (featured === "true") query.isFeatured = true
        if (activeOnly) query.isActive = true

        const products = await Product.find(query).sort({ order: 1, createdAt: -1 }).lean()
        return NextResponse.json(products)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect()
        const data = await req.json()

        // Auto-generate slug if not provided
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
        }

        const product = await Product.create(data)
        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect()
        const { _id, ...updateData } = await req.json()

        if (!_id) return NextResponse.json({ error: "No ID provided" }, { status: 400 })

        const updated = await Product.findByIdAndUpdate(_id, updateData, { new: true })
        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 })

        await Product.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
