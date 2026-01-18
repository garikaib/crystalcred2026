import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir, chmod } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Media } from "@/models/Media";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    let mediaId = null;
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-").toLowerCase();

        // Initial Metadata Check
        const metadata = await sharp(buffer).metadata();
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;

        // 1. Create DB Entry (Status: PROCESSING)
        const timestamp = Date.now();
        const baseFilename = `${timestamp}-${originalName}`;
        const originalFilename = `${baseFilename}.webp`; // We always convert to WebP

        const mediaEntry = await Media.create({
            filename: originalFilename,
            url: `/uploads/${originalFilename}`,
            altText: originalName,
            title: originalName,
            width: originalWidth,
            height: originalHeight,
            size: buffer.length,
            mimeType: "image/webp",
            status: 'processing', // Start as processing
            versions: {}
        });
        mediaId = mediaEntry._id;
        console.log(`Media Upload Started: ${mediaId} (${originalName})`);

        // 2. Process Files (Async but we await it for simplicity in this implementation)
        // In a larger app, this would be a background job
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Process Original
        const originalPath = path.join(uploadDir, originalFilename);
        await sharp(buffer)
            .webp({ quality: 90 })
            .toFile(originalPath);
        await chmod(originalPath, 0o644);

        // Process Variations
        const versions = {
            large: { width: 1200, height: null, suffix: '-large' },
            medium: { width: 800, height: null, suffix: '-medium' },
            thumbnail: { width: 150, height: 150, suffix: '-thumb' }
        };

        const savedVersions: any = {};

        for (const [key, config] of Object.entries(versions)) {
            const versionFilename = `${baseFilename}${config.suffix}.webp`;
            const filepath = path.join(uploadDir, versionFilename);

            let pipeline = sharp(buffer).webp({ quality: 80 });

            if (config.width) {
                if (config.height) {
                    pipeline = pipeline.resize(config.width, config.height, { fit: 'cover' });
                } else if (originalWidth > config.width) {
                    pipeline = pipeline.resize(config.width, null, { withoutEnlargement: true });
                }
            }

            await pipeline.toFile(filepath);
            await chmod(filepath, 0o644);
            const stats = await sharp(filepath).metadata();

            savedVersions[key] = {
                url: `/uploads/${versionFilename}`,
                width: stats.width,
                height: stats.height
            };
        }

        // 3. Update DB to READY
        const readyMedia = await Media.findByIdAndUpdate(mediaId, {
            status: 'ready',
            versions: savedVersions
        }, { new: true });

        console.log(`Media Upload Complete: ${mediaId}`);
        return NextResponse.json(readyMedia);

    } catch (error: any) {
        console.error("Upload error:", error);

        // 4. Update DB to ERROR if we created an entry
        if (mediaId) {
            await Media.findByIdAndUpdate(mediaId, {
                status: 'error',
                error: error.message || "Processing failed"
            });
        }

        return NextResponse.json({
            error: "Upload failed",
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        console.log("Media API GET - Session:", session?.user?.email);

        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Media API GET - Connecting to DB...");
        await dbConnect();
        console.log("Media API GET - Connected. Fetching media...");

        const images = await Media.find().sort({ createdAt: -1 }).lean();
        console.log(`Media API GET - Found ${images.length} images`);

        return NextResponse.json(images);
    } catch (error: any) {
        console.error("List files error (DETAILED):", error);
        return NextResponse.json({
            error: "Failed to list files",
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const formData = await req.formData();
        const _id = formData.get("_id") as string;
        const altText = formData.get("altText") as string;
        const title = formData.get("title") as string;
        const caption = formData.get("caption") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File | null;

        if (!_id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const existingMedia = await Media.findById(_id);
        if (!existingMedia) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 });
        }

        let updateData: any = { altText, title, caption, description };

        if (file) {
            console.log("Media API PUT - Replacing file for ID:", _id);
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            // 1. Delete old files
            const deleteFile = async (fileUrl: string) => {
                try {
                    const filename = fileUrl.split("/").pop();
                    if (filename) await unlink(path.join(uploadDir, filename));
                } catch (e) {
                    console.error("Old file delete error:", e);
                }
            };

            await deleteFile(existingMedia.url);
            if (existingMedia.versions) {
                for (const version of Object.values(existingMedia.versions) as any) {
                    if (version?.url) await deleteFile(version.url);
                }
            }

            // 2. Process new file
            const buffer = Buffer.from(await file.arrayBuffer());
            const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-").toLowerCase();
            const timestamp = Date.now();
            const baseFilename = `${timestamp}-${originalName}`;

            const metadata = await sharp(buffer).metadata();
            const originalWidth = metadata.width || 0;
            const originalHeight = metadata.height || 0;

            const versions = {
                large: { width: 1200, height: null, suffix: '-large' },
                medium: { width: 800, height: null, suffix: '-medium' },
                thumbnail: { width: 150, height: 150, suffix: '-thumb' }
            };

            const savedVersions: any = {};
            const originalFilename = `${baseFilename}.webp`;
            await sharp(buffer).webp({ quality: 90 }).toFile(path.join(uploadDir, originalFilename));

            for (const [key, config] of Object.entries(versions)) {
                const versionFilename = `${baseFilename}${config.suffix}.webp`;
                const filepath = path.join(uploadDir, versionFilename);
                let pipeline = sharp(buffer).webp({ quality: 80 });

                if (config.width) {
                    if (config.height) {
                        pipeline = pipeline.resize(config.width, config.height, { fit: 'cover' });
                    } else if (originalWidth > config.width) {
                        pipeline = pipeline.resize(config.width, null, { withoutEnlargement: true });
                    }
                }

                await pipeline.toFile(filepath);
                const stats = await sharp(filepath).metadata();
                savedVersions[key] = {
                    url: `/uploads/${versionFilename}`,
                    width: stats.width,
                    height: stats.height
                };
            }

            updateData = {
                ...updateData,
                filename: originalFilename,
                url: `/uploads/${originalFilename}`,
                width: originalWidth,
                height: originalHeight,
                size: buffer.length,
                versions: savedVersions
            };
        }

        const updatedMedia = await Media.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json(updatedMedia);

    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const media = await Media.findById(id);
        if (!media) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 });
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Helper to delete file safely
        const deleteFile = async (fileUrl: string) => {
            try {
                const filename = fileUrl.split("/").pop();
                if (filename) {
                    await unlink(path.join(uploadDir, filename));
                }
            } catch (e) {
                console.error("File delete error (might not exist):", e);
            }
        };

        // Delete main image
        await deleteFile(media.url);

        // Delete versions
        if (media.versions) {
            for (const version of Object.values(media.versions) as any) {
                if (version && version.url) {
                    await deleteFile(version.url);
                }
            }
        }

        await Media.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
