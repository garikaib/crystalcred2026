import mongoose, { Schema, Document, Model } from "mongoose"

export interface IMedia extends Document {
    filename: string
    url: string
    altText: string
    title?: string
    caption?: string
    description?: string
    width: number
    height: number
    size: number
    mimeType: string
    versions: {
        thumbnail?: { url: string; width: number; height: number }
        medium?: { url: string; width: number; height: number }
        large?: { url: string; width: number; height: number }
    }
    createdAt: Date
    updatedAt: Date
}

const MediaSchema = new Schema<IMedia>(
    {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        altText: { type: String, default: "" },
        title: { type: String },
        caption: { type: String },
        description: { type: String },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        size: { type: Number, required: true },
        mimeType: { type: String, required: true },
        versions: {
            thumbnail: {
                url: String,
                width: Number,
                height: Number,
            },
            medium: {
                url: String,
                width: Number,
                height: Number,
            },
            large: {
                url: String,
                width: Number,
                height: Number,
            },
        },
    },
    { timestamps: true }
)

export const Media: Model<IMedia> =
    mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema)
