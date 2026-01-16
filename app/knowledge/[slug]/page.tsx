import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"

import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { Button } from "@/components/ui/button"
import { CTASection } from "@/components/sections/CTASection"

export const revalidate = 3600

async function getPost(slug: string) {
    await dbConnect()
    try {
        const post = await BlogPost.findOne({ slug, status: "published" }).lean()
        if (!post) return null
        return JSON.parse(JSON.stringify(post))
    } catch (error) {
        return null
    }
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen">
            <article className="flex-grow">
                {/* Header */}
                <header className="bg-secondary/30 py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="mb-6">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/knowledge" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                    <ChevronLeft size={16} /> Back to Hub
                                </Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="bg-white px-3 py-1 rounded-full text-primary font-medium">{post.category}</span>
                            <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                            <span>By {post.author}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{post.title}</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-4 max-w-4xl py-12">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-foreground prose-a:text-primary prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <CTASection />
        </div>
    )
}
