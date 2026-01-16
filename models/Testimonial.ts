import mongoose, { Schema, Document, Model } from "mongoose"

export interface ITestimonial extends Document {
    name: string
    role: string
    content: string
    rating: number
    image?: string
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        content: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        image: { type: String },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const Testimonial: Model<ITestimonial> =
    mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema)
