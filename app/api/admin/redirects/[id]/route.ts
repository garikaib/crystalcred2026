import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Redirect from "@/models/Redirect"
import * as z from "zod"

const updateRedirectSchema = z.object({
    source: z.string().min(1).startsWith("/").optional(),
    destination: z.string().min(1).optional(),
    type: z.coerce.number().optional(),
    isActive: z.boolean().optional(),
    ignoreQueryParams: z.boolean().optional(),
})

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()
        const validation = updateRedirectSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation Error", details: validation.error.format() },
                { status: 400 }
            )
        }

        const redirect = await Redirect.findByIdAndUpdate(id, validation.data, {
            new: true,
            runValidators: true,
        })

        if (!redirect) {
            return NextResponse.json({ error: "Redirect not found" }, { status: 404 })
        }

        return NextResponse.json(redirect)
    } catch (error) {
        console.error("Error updating redirect:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const redirect = await Redirect.findByIdAndDelete(id)

        if (!redirect) {
            return NextResponse.json({ error: "Redirect not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Redirect deleted successfully" })
    } catch (error) {
        console.error("Error deleting redirect:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
