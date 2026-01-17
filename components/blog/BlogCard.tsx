import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 overflow-hidden group border-muted/60">
            {/* Image Container - Aspect Ratio 16:9 */}
            <div className="relative aspect-video w-full bg-muted/30 overflow-hidden">
                {post.featuredImage ? (
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/30">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm font-medium">No Image</span>
                    </div>
                )}

                {/* Category Badge - Overlaid */}
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="backdrop-blur-sm bg-background/80 hover:bg-background/90 font-medium">
                        {post.category || "General"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                    <span className="flex items-center">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>{post.author || "Admin"}</span>
                </div>

                <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/knowledge/${post.slug}`} className="block">
                        {post.title}
                    </Link>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-1 flex-grow">
                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto">
                <Link href={`/knowledge/${post.slug}`} className="w-full cursor-pointer">
                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary group/btn pl-0 cursor-pointer">
                        <span className="font-semibold">Read Article</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
