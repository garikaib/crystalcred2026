import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRedirect extends Document {
    source: string
    destination: string
    type: number // 301 (Permanent) or 302 (Temporary)
    isActive: boolean
    ignoreQueryParams: boolean
    createdAt: Date
    updatedAt: Date
}

const RedirectSchema = new Schema<IRedirect>(
    {
        source: {
            type: String,
            required: [true, "Source path is required"],
            unique: true,
            trim: true,
        },
        destination: {
            type: String,
            required: [true, "Destination path is required"],
            trim: true,
        },
        type: {
            type: Number,
            enum: [301, 302],
            default: 301,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        ignoreQueryParams: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Prevent compiling model multiple times in development
const Redirect: Model<IRedirect> =
    mongoose.models.Redirect || mongoose.model<IRedirect>("Redirect", RedirectSchema)

export default Redirect
