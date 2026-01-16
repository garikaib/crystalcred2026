
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import fs from "fs"
import path from "path"
import dbConnect from "@/lib/mongodb"
import { Media } from "@/models/Media"
import sharp from "sharp"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { url, filename, altText } = await req.json()
        if (!url) return NextResponse.json({ error: "URL missing" }, { status: 400 })

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to download image from Unsplash")
        const buffer = Buffer.from(await response.arrayBuffer())

        const uploadsDir = path.join(process.cwd(), "public/uploads")
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

        const timestamp = Date.now()
        const safeFilename = filename.toLowerCase().replace(/[^a-z0-9.]/g, "-")
        const finalFilename = `${timestamp}-${safeFilename}.webp`
        const finalPath = path.join(uploadsDir, finalFilename)

        // Process and Save as WebP
        const metadata = await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(finalPath)

        // Create resized versions
        const sizes = [
            { name: "thumb", width: 200 },
            { name: "medium", width: 800 },
            { name: "large", width: 1200 },
        ]

        const versions: any = {}
        for (const size of sizes) {
            if (metadata.width && metadata.width > size.width) {
                const name = `${timestamp}-${safeFilename}-${size.name}.webp`
                const p = path.join(uploadsDir, name)
                const m = await sharp(buffer)
                    .resize(size.width)
                    .webp({ quality: 80 })
                    .toFile(p)
                versions[size.name] = {
                    url: `/uploads/${name}`,
                    width: m.width,
                    height: m.height
                }
            }
        }

        await dbConnect()
        const media = await Media.create({
            filename: finalFilename,
            url: `/uploads/${finalFilename}`,
            altText: altText || "Unsplash Image",
            width: metadata.width,
            height: metadata.height,
            size: metadata.size,
            mimeType: "image/webp",
            versions
        })

        return NextResponse.json(media)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
