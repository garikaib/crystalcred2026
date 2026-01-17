import mongoose, { Schema, Document, Model } from "mongoose"

export interface INotice extends Document {
    title: string
    content: string
    type: "info" | "warning" | "success" | "destructive"
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const NoticeSchema = new Schema<INotice>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ["info", "warning", "success", "destructive"],
            default: "info"
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default (mongoose.models.Notice as Model<INotice>) || mongoose.model<INotice>("Notice", NoticeSchema)
