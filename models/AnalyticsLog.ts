import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsLog extends Document {
    eventType: 'pageview' | 'vitals';
    url: string;
    visitorHash: string;
    country?: string;
    device?: string;
    browser?: string;
    vitals?: {
        name: string;
        value: number;
        rating: string; // 'good' | 'needs-improvement' | 'poor'
    };
    createdAt: Date;
}

const AnalyticsLogSchema = new Schema<IAnalyticsLog>(
    {
        eventType: { type: String, required: true, enum: ['pageview', 'vitals'] },
        url: { type: String, required: true },
        visitorHash: { type: String, required: true }, // Anonymized (Daily Salt + IP + UA)
        country: { type: String },
        device: { type: String },
        browser: { type: String },
        vitals: {
            name: String,
            value: Number,
            rating: String,
        },
    },
    { timestamps: true }
);

// TTL Index: Automatically delete logs older than 90 days to save space
AnalyticsLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const AnalyticsLog: Model<IAnalyticsLog> =
    mongoose.models.AnalyticsLog || mongoose.model<IAnalyticsLog>('AnalyticsLog', AnalyticsLogSchema);

export default AnalyticsLog;
