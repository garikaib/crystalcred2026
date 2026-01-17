"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MediaManager } from "@/components/admin/MediaManager"

interface GalleryItem {
    _id: string
    title: string
    category: string
    image: string
    description: string
    order: number
}

const CATEGORIES = ["Residential", "Commercial", "Industrial", "Agricultural", "Other"]

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({})
    const [showMediaManager, setShowMediaManager] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchItems()
    }, [])

    async function fetchItems() {
        try {
            const res = await fetch("/api/gallery")
            if (res.ok) {
                setItems(await res.json())
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const url = currentItem._id ? `/api/gallery/${currentItem._id}` : "/api/gallery"
            const method = currentItem._id ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentItem),
            })

            if (!res.ok) throw new Error("Failed to save")

            toast({ title: "Success", description: "Gallery item saved successfully" })
            setIsDialogOpen(false)
            fetchItems()
        } catch (error) {
            toast({ title: "Error", description: "Failed to save item", variant: "destructive" })
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")

            toast({ title: "Success", description: "Item deleted successfully" })
            fetchItems()
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete item", variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gallery Management</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setCurrentItem({})}>
                            <Plus className="mr-2 h-4 w-4" /> Add New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{currentItem._id ? "Edit Item" : "Add New Item"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Title</label>
                                <Input
                                    value={currentItem.title || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Category</label>
                                <Select
                                    value={currentItem.category}
                                    onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Image</label>
                                <div className="flex gap-4 items-start">
                                    {currentItem.image ? (
                                        <div className="relative w-32 h-24 rounded-lg overflow-hidden border">
                                            <Image
                                                src={currentItem.image}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-24 rounded-lg border border-dashed flex items-center justify-center bg-gray-50 text-gray-400">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                    <Button type="button" variant="outline" onClick={() => setShowMediaManager(true)}>
                                        Select Image
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Description</label>
                                <Textarea
                                    value={currentItem.description || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Item</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={showMediaManager} onOpenChange={setShowMediaManager}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh]">
                        <MediaManager
                            onSelect={(item: any) => {
                                setCurrentItem({ ...currentItem, image: item.url })
                                setShowMediaManager(false)
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="group relative bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setCurrentItem(item)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                <div className="text-sm text-muted-foreground mb-2">{item.category}</div>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            No items found. Add your first project!
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
