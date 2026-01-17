import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import { Media } from "../models/Media"
import dotenv from "dotenv"
import { ensureSafeToRun } from "./utils/safeguard"

ensureSafeToRun();

dotenv.config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined")
    process.exit(1)
}

const FILES_TO_MIGRATE = [
    {
        src: "public/images/cropped_logo.png",
        altText: "CrystalCred Logo",
        width: 1160,
        height: 848,
        mimeType: "image/png"
    },
    {
        src: "public/images/favicon.png",
        altText: "CrystalCred Favicon",
        width: 516,
        height: 560,
        mimeType: "image/png"
    },
    {
        src: "public/images/hero-bg.jpg",
        altText: "CrystalCred Hero Background",
        width: 2070,
        height: 1378,
        mimeType: "image/jpeg"
    }
]

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI!)
        console.log("Connected to MongoDB")

        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        for (const file of FILES_TO_MIGRATE) {
            const srcPath = path.join(process.cwd(), file.src)
            if (!fs.existsSync(srcPath)) {
                console.warn(`File not found: ${file.src}`)
                continue
            }

            const stats = fs.statSync(srcPath)
            const timestamp = Date.now()
            const ext = path.extname(file.src)
            const basename = path.basename(file.src, ext)
            const newFilename = `${timestamp}-${basename}${ext}`
            const newPath = path.join(uploadsDir, newFilename)

            // Copy file
            fs.copyFileSync(srcPath, newPath)
            console.log(`Copied ${file.src} to public/uploads/${newFilename}`)

            // Create DB entry
            const url = `/uploads/${newFilename}`
            await Media.create({
                filename: newFilename,
                url: url,
                altText: file.altText,
                width: file.width,
                height: file.height,
                size: stats.size,
                mimeType: file.mimeType,
                versions: {} // No resized versions for these for now
            })

            console.log(`Created Media entry for ${file.src} at ${url}`)
        }

        console.log("Migration complete")
        process.exit(0)
    } catch (error) {
        console.error("Migration failed:", error)
        process.exit(1)
    }
}

migrate()
