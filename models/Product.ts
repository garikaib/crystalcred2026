import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProduct extends Document {
    name: string
    slug: string
    category: string
    image: string
    price: string
    description: string
    badge?: string
    isFeatured: boolean
    isBestSeller: boolean
    isBestValue: boolean
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        badge: { type: String },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        isBestValue: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
