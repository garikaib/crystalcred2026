import mongoose, { Schema, model, models } from "mongoose";

const PageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        // Using Mixed type for flexible content structure per page
        // For 'about' page, this will contain: hero, story, values, vision objects
        sections: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Page = models.Page || model("Page", PageSchema);

export default Page;
