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
import { DeletePostButton } from "@/components/admin/DeletePostButton"
import { FileText, Globe } from "lucide-react"
import { Search } from "@/components/admin/Search"
import { PaginationControls } from "@/components/admin/PaginationControls"

export default async function AdminBlogPage({
    searchParams,
}: {
    searchParams?: Promise<{
        q?: string
        page?: string
    }>
}) {
    await dbConnect()

    // Await params for Next.js 15+ compatibility
    const params = await searchParams;
    const query = params?.q || ""
    const currentPage = Number(params?.page) || 1
    const itemsPerPage = 10

    // Build Search Query
    const searchCondition = query
        ? { title: { $regex: query, $options: "i" } }
        : {}

    // Fetch Data
    const totalCount = await BlogPost.countDocuments(searchCondition)
    const posts = await BlogPost.find(searchCondition)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .lean()

    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

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

            <div className="flex items-center justify-between gap-4">
                <Search placeholder="Search by title..." />
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
                                    {query ? "No results found." : "No posts found. Create your first one!"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post: any) => (
                                <TableRow key={post._id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={post.status === "published" ? "default" : "secondary"}
                                            className={post.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"}
                                        >
                                            <div className="flex items-center gap-1.5 py-0.5">
                                                {post.status === "published" ? (
                                                    <Globe className="h-3 w-3" />
                                                ) : (
                                                    <FileText className="h-3 w-3" />
                                                )}
                                                <span className="capitalize">{post.status}</span>
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                            {post.category}
                                        </span>
                                    </TableCell>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                />
            )}
        </div>
    )
}
