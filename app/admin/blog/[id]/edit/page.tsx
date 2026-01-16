import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { BlogForm } from "@/components/admin/BlogForm"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: PageProps) {
    const { id } = await params
    if (!id) return notFound()

    await dbConnect()
    let post
    try {
        post = await BlogPost.findById(id).lean()
    } catch (e) {
        return notFound()
    }

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
            <BlogForm initialData={JSON.parse(JSON.stringify(post))} isEditing />
        </div>
    )
}
