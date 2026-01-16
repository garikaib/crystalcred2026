import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Shadcn badge? Need to install or just use span. I'll use simple span for now or check if badge installed. (Not in list, I'll use span).

interface BlogPost {
    _id: string
    title: string
    slug: string
    excerpt: string
    featuredImage: string
    category: string
    createdAt: Date
    author: string
}

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {/* Placeholder */}
                    <span>Blog Image</span>
                </div>
                {/* <Image
          src={post.featuredImage || "/images/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover"
        /> */}
                <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{post.category}</span>
                </div>
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/knowledge/${post.slug}`}>
                        {post.title}
                    </Link>
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-2 flex justify-between items-center">
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                    <span className="text-xs">By {post.author}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-muted-foreground line-clamp-3 text-sm">{post.excerpt}</p>
            </CardContent>
        </Card>
    )
}
