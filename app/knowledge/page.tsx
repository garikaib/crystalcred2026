import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { BlogCard } from "@/components/blog/BlogCard"
import { CTASection } from "@/components/sections/CTASection"

// Revalidate every hour
export const revalidate = 3600

async function getPosts() {
    await dbConnect()
    try {
        // Find published posts, sort by createdAt desc
        const posts = await BlogPost.find({ status: "published" })
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(posts)) // Serialize for Next.js
    } catch (error) {
        console.error("Error fetching posts:", error)
        return []
    }
}

export default async function KnowledgeHubPage() {
    const posts = await getPosts()

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-secondary/30 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Knowledge Hub</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Insights, news, and guides on solar energy and sustainability.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post: any) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Articles Yet</h3>
                            <p className="text-muted-foreground">Check back soon for updates!</p>
                        </div>
                    )}
                </div>
            </section>

            <CTASection />
        </div>
    )
}
