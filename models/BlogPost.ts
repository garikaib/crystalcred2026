import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    category: string;
    status: "draft" | "published";
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        featuredImage: { type: String },
        category: { type: String, default: "General" },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        author: { type: String },
    },
    { timestamps: true }
);

// Prevent overwrite errors during hot reloading
export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
