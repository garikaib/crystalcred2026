import Link from "next/link"
import { Plus, Edit, Trash, ExternalLink } from "lucide-react"

import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DeletePostButton } from "@/components/admin/DeletePostButton" // Client component for delete

export default async function AdminBlogPage() {
    await dbConnect()
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Button asChild>
                    <Link href="/admin/blog/create">
                        <Plus className="mr-2 h-4 w-4" /> Create New
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No posts found. Create your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post: any) => (
                                <TableRow key={post._id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{post.category}</TableCell>
                                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {post.status === "published" && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/knowledge/${post.slug}`} target="_blank">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/blog/${post._id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeletePostButton id={post._id.toString()} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
