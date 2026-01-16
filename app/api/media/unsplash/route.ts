
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || "solar energy"
    const page = searchParams.get("page") || "1"
    const perPage = searchParams.get("per_page") || "20"

    const accessKey = process.env.UNSPLASH_ACCESS_KEY
    if (!accessKey) {
        return NextResponse.json({ error: "Unsplash Access Key missing" }, { status: 500 })
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
            }
        )

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(error, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
