"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MediaManager } from "./MediaManager"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md" />
})

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().optional(),
    content: z.string().min(20, "Content must be at least 20 characters"),
    excerpt: z.string().optional(),
    category: z.string().min(1, "Please select a category"),
    status: z.enum(["draft", "published"]),
    featuredImage: z.string().optional(),
})

interface BlogFormProps {
    initialData?: any
    isEditing?: boolean
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            category: "General",
            status: "draft",
            featuredImage: "",
        },
    })

    // Helper to generate URL-friendly slugs
    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const url = isEditing ? `/api/blog/${initialData._id}` : "/api/blog"
            const method = isEditing ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!res.ok) throw new Error("Failed to save post")

            router.push("/admin/blog")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Post Title"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            // Auto-generate slug if creating new post or slug is empty
                                            // We check if form.getValues("slug") is falsey to allow auto-fill on first type
                                            if (!isEditing || !form.getValues("slug")) {
                                                form.setValue("slug", generateSlug(e.target.value))
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="post-url-slug" {...field} />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => form.setValue("slug", generateSlug(form.getValues("title")))}
                                            title="Regenerate from title"
                                        >
                                            ↺
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>Auto-generated from title, but fully editable.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <div data-gramm="false">
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-[300px] mb-12 bg-white"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief summary for list views" className="h-24" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Solar tips">Solar Tips</SelectItem>
                                        <SelectItem value="News">Industry News</SelectItem>
                                        <SelectItem value="Projects">Projects</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="featuredImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Featured Image</FormLabel>
                                <FormControl>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input placeholder="https://..." {...field} readOnly className="bg-gray-50 text-gray-500" />
                                            <MediaManager onSelect={field.onChange} />
                                        </div>
                                        {field.value && (
                                            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-gray-100">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={field.value}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Update Post" : "Create Post"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
