import mongoose, { Schema, Document, Model } from "mongoose"

export interface IActivityLog extends Document {
    action: string
    description: string
    user?: string
    metadata?: any
    createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        action: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: String },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

export default (mongoose.models.ActivityLog as Model<IActivityLog>) || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema)
