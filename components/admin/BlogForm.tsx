"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Lock, Unlock, Settings2, Plus, FileText, Globe, ImageIcon, Eye } from "lucide-react"
import dynamic from 'next/dynamic'
// import 'react-quill-new/dist/quill.snow.css'

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
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MediaManager } from "./MediaManager"
import { CategoryManager } from "./CategoryManager"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { useToast } from "@/hooks/use-toast"
import { logActivityAction } from "@/app/actions/log-activity"

// Dynamically import ReactQuill to avoid SSR issues
// REMOVED: Quill import

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
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSlugEditable, setIsSlugEditable] = useState(false)
    const [createRedirect, setCreateRedirect] = useState(true)
    const [categories, setCategories] = useState<any[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            content: initialData?.content || "",
            excerpt: initialData?.excerpt || "",
            category: initialData?.category || "General",
            status: initialData?.status || "draft",
            featuredImage: initialData?.featuredImage || "",
        },
    })

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true)
        try {
            const res = await fetch("/api/admin/categories")
            if (res.ok) {
                const data = await res.json()
                setCategories(data)

                // If no categories found, we should probably add General as a default option if it's missing
                if (data.length === 0) {
                    setCategories([{ _id: "default", name: "General", slug: "general" }])
                }
            }
        } catch (error) {
            console.error("Failed to fetch categories", error)
        } finally {
            setIsLoadingCategories(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

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

    // Helper for SEO Status
    const getSeoStatus = (text: string = "") => {
        const length = text.length
        let width = 0
        let color = "bg-slate-200"
        let textColor = "text-slate-500"
        let label = "Enter a summary"

        if (length === 0) {
            return { width: 0, color: "bg-slate-200", textColor: "text-slate-400", label: "Empty" }
        }

        if (length < 120) {
            width = (length / 160) * 100
            color = "bg-orange-400"
            textColor = "text-orange-600"
            label = "Too Short (aim for 120-160 chars)"
        } else if (length <= 160) {
            width = (length / 160) * 100
            color = "bg-green-500"
            textColor = "text-green-600"
            label = "Optimal Length"
        } else {
            width = 100
            color = "bg-red-500"
            textColor = "text-red-600"
            label = "Too Long (might be truncated)"
        }

        return { width, color, textColor, label, length }
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

            // Handle Auto-Redirect
            if (isEditing && initialData.status === 'published' && initialData.slug !== values.slug && createRedirect) {
                try {
                    const redirectRes = await fetch("/api/admin/redirects", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            source: `/knowledge/${initialData.slug}`,
                            destination: `/knowledge/${values.slug}`,
                            type: 301 // Ensuring it's a number as per schema
                        })
                    })

                    if (redirectRes.ok) {
                        toast({
                            title: "Redirect Created",
                            description: `Forwarding /knowledge/${initialData.slug} to the new URL.`,
                        })
                    } else {
                        const errData = await redirectRes.json()
                        console.error("Redirect creation failed", errData)
                        toast({
                            variant: "destructive",
                            title: "Redirect Info",
                            description: errData.error || "Could not auto-create redirect. It might already exist.",
                        })
                    }

                } catch (err) {
                    console.error("Failed to auto-create redirect", err)
                }
            }

            toast({
                title: isEditing ? "Post Updated" : "Post Created",
                description: `"${values.title}" has been saved successfully.`,
            })

            // Log Activity asynchronously (don't await to keep UI snappy)
            logActivityAction(
                isEditing ? "updated_post" : "created_post",
                `${isEditing ? "Updated" : "Created"} blog post: ${values.title}`,
                { slug: values.slug, id: isEditing ? initialData._id : undefined }
            )

            router.push("/admin/blog")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePreview = () => {
        const slug = form.getValues("slug") || initialData?.slug
        if (slug) {
            window.open(`/knowledge/${slug}`, '_blank')
        } else {
            toast({
                title: "Cannot Preview",
                description: "This post needs a slug before it can be previewed.",
                variant: "destructive"
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Post Title..."
                                            {...field}
                                            className="text-2xl md:text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto placeholder:opacity-30"
                                            onChange={(e) => {
                                                field.onChange(e)
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
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={(val) => {
                                                field.onChange(val)
                                            }}
                                            className="min-h-[600px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-gray-900">Publishing</h3>
                            {/* Preview Button */}
                            <Button type="button" variant="outline" size="sm" onClick={handlePreview} title="Preview Post">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2 w-full">
                            <Button type="button" variant="ghost" className="flex-1" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update" : "Publish"}
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase">Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft" className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>Draft</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="published" className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Globe className="h-3.5 w-3.5 text-green-600" />
                                                        <span className="font-medium text-green-700">Published</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase">Category</FormLabel>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[10px] text-teal-600 hover:text-teal-700 hover:bg-teal-50 flex items-center gap-1 px-1.5"
                                            onClick={() => setIsCategoryManagerOpen(true)}
                                        >
                                            <Settings2 className="h-3 w-3" />
                                            <span>Manage</span>
                                        </Button>
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value || "General"}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-teal-50 focus:ring-teal-100">
                                                <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select Category"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <SelectItem key={cat._id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))
                                            ) : !isLoadingCategories ? (
                                                <SelectItem value="General">General</SelectItem>
                                            ) : null}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Featured Image Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <FormField
                            control={form.control}
                            name="featuredImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase">Featured Image</FormLabel>
                                    <div className="space-y-3">
                                        {field.value ? (
                                            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-gray-100 group">
                                                <img
                                                    src={field.value}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <MediaManager
                                                        trigger={
                                                            <Button type="button" variant="secondary" size="sm">
                                                                Change
                                                            </Button>
                                                        }
                                                        onSelect={(item) => field.onChange(item.url)}
                                                    />
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => field.onChange("")}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 transition-colors">
                                                <div className="p-2 bg-gray-100 rounded-full">
                                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-500">No image selected</p>
                                                    <MediaManager
                                                        trigger={
                                                            <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                                                                Select Image
                                                            </Button>
                                                        }
                                                        onSelect={(item) => field.onChange(item.url)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* SEO / Advanced Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">SEO & Url</span>
                            <div className="h-px flex-1 bg-teal-100"></div>
                        </div>

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-medium text-teal-800">
                                            Slug
                                        </FormLabel>
                                        <div className="flex items-center gap-1">
                                            {isEditing && initialData?.status === "published" && field.value !== initialData.slug && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <Switch
                                                        id="create-redirect"
                                                        checked={createRedirect}
                                                        onCheckedChange={setCreateRedirect}
                                                        className="scale-75 origin-right"
                                                    />
                                                    <label
                                                        htmlFor="create-redirect"
                                                        className="text-[10px] text-muted-foreground cursor-pointer select-none"
                                                    >
                                                        Redirect?
                                                    </label>
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsSlugEditable(!isSlugEditable)}
                                                className="h-6 w-6 p-0 hover:bg-teal-100"
                                            >
                                                {isSlugEditable ? <Lock className="h-3 w-3 text-teal-700" /> : <Unlock className="h-3 w-3 text-teal-600" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="post-url-slug"
                                                {...field}
                                                disabled={!isSlugEditable}
                                                className={`h-8 text-xs font-mono ${!isSlugEditable ? "bg-white/50 text-muted-foreground" : "bg-white"} border-teal-50`}
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
                                <FormItem className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-medium text-teal-800">
                                            Meta Description
                                        </FormLabel>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const status = getSeoStatus(field.value)
                                                return (
                                                    <span className={`text-[9px] font-medium ${status.textColor}`}>
                                                        {status.length} / 160
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                    <FormControl>
                                        <div className="space-y-1.5">
                                            <Textarea
                                                placeholder="Summary for generic search results..."
                                                className="h-24 text-xs bg-white/50 focus:bg-white resize-none border-teal-100"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                }}
                                            />
                                            {/* Progress Bar */}
                                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                {(() => {
                                                    const status = getSeoStatus(field.value)
                                                    return (
                                                        <div
                                                            className={`h-full transition-all duration-300 ${status.color}`}
                                                            style={{ width: `${status.width}%` }}
                                                        />
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>

            <CategoryManager
                open={isCategoryManagerOpen}
                onOpenChange={setIsCategoryManagerOpen}
                onCategoriesChange={fetchCategories}
            />
        </Form >
    )
}
