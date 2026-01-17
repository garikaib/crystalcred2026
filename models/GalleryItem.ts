import mongoose, { Schema, Document, Model } from "mongoose"

export interface IGalleryItem extends Document {
    title: string
    category: string
    image: string
    description?: string
    order: number
    featured: boolean
    createdAt: Date
    updatedAt: Date
}

const GalleryItemSchema = new Schema<IGalleryItem>(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String },
        order: { type: Number, default: 0 },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export const GalleryItem: Model<IGalleryItem> =
    mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema)
