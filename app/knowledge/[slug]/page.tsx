import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft, Edit3 } from "lucide-react"

import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { Button } from "@/components/ui/button"
import { CTASection } from "@/components/sections/CTASection"
import { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        return {
            title: "Post Not Found | CrystalCred",
        }
    }

    return {
        title: `${post.title} | CrystalCred Knowledge`,
        description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
            images: post.featuredImage ? [post.featuredImage] : [],
            type: "article",
            publishedTime: post.createdAt,
            authors: [post.author || "CrystalCred Team"],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    }
}

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
    const session = await auth()

    if (!post) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen">
            <article className="flex-grow">
                {/* Header */}
                {/* Header */}
                <header className="bg-secondary/30 py-16 relative overflow-hidden">
                    <div className="container mx-auto px-4 max-w-4xl relative z-10">
                        <div className="mb-6 flex items-center justify-between">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/knowledge" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                    <ChevronLeft size={16} /> Back to Hub
                                </Link>
                            </Button>
                            {/* Edit Button for Admins */}
                            {session?.user?.role === "admin" && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/blog/${post._id}/edit`} className="flex items-center gap-2">
                                        <Edit3 size={14} /> Edit Post
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                {format(new Date(post.createdAt), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                By {post.author || "CrystalCred Team"}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-8 tracking-tight">
                            {post.title}
                        </h1>

                        {/* Featured Image */}
                        {post.featuredImage && (
                            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mt-8">
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
                    <div
                        className="prose prose-lg md:prose-xl max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 
                        prose-p:text-slate-600 prose-p:leading-relaxed 
                        prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-code:bg-secondary/50 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <CTASection />
        </div>
    )
}
