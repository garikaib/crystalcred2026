import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { Testimonial } from "@/models/Testimonial"

export async function GET() {
    await dbConnect()
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const data = await req.json()
    const testimonial = await Testimonial.create(data)
    return NextResponse.json(testimonial)
}

export async function PUT(req: NextRequest) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const data = await req.json()
    const { _id, ...updateData } = data

    if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const updated = await Testimonial.findByIdAndUpdate(_id, updateData, { new: true })
    return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await Testimonial.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
}
