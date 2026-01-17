import { BlogForm } from "@/components/admin/BlogForm"

export default function CreateBlogPostPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
            <BlogForm />
        </div>
    )
}
