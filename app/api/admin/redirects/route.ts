import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Redirect from "@/models/Redirect"
import * as z from "zod"

const createRedirectSchema = z.object({
    source: z.string().min(1, "Source path is required").startsWith("/", "Source must start with /"),
    destination: z.string().min(1, "Destination path is required"),
    type: z.preprocess((val) => Number(val), z.number().refine(val => [301, 302].includes(val))).optional().default(301),
    isActive: z.boolean().optional().default(true),
    ignoreQueryParams: z.boolean().optional().default(true),
})

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const searchParams = req.nextUrl.searchParams
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""

        const query: any = {}
        if (search) {
            query.$or = [
                { source: { $regex: search, $options: "i" } },
                { destination: { $regex: search, $options: "i" } },
            ]
        }

        const skip = (page - 1) * limit

        const redirects = await Redirect.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Redirect.countDocuments(query)

        return NextResponse.json({
            redirects,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching redirects:", error)
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
        const validation = createRedirectSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation Error", details: validation.error.format() },
                { status: 400 }
            )
        }

        const { source, destination, type, isActive, ignoreQueryParams } = validation.data

        // Check if source already exists
        const existingRedirect = await Redirect.findOne({ source })
        if (existingRedirect) {
            return NextResponse.json(
                { error: "A redirect for this source path already exists" },
                { status: 409 }
            )
        }

        // Prevent redirect loop (basic check: source == destination)
        if (source === destination) {
            return NextResponse.json(
                { error: "Source and destination cannot be the same" },
                { status: 400 }
            )
        }

        const redirect = await Redirect.create({
            source,
            destination,
            type,
            isActive,
            ignoreQueryParams,
        })

        return NextResponse.json(redirect, { status: 201 })
    } catch (error) {
        console.error("Error creating redirect:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
