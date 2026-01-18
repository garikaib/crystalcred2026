"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { MediaManager } from "@/components/admin/MediaManager"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"

interface Testimonial {
    _id?: string
    name: string
    role: string
    content: string
    rating: number
    image?: string
    order: number
    isActive: boolean
}

export default function AdminTestimonialsPage() {
    const [items, setItems] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [showMediaManager, setShowMediaManager] = useState(false)

    const emptyItem: Testimonial = {
        name: "", role: "", content: "", rating: 5, image: "", order: 0, isActive: true
    }

    useEffect(() => { fetchItems() }, [])

    async function fetchItems() {
        setIsLoading(true)
        const res = await fetch("/api/testimonials")
        if (res.ok) setItems(await res.json())
        setIsLoading(false)
    }

    async function handleSave() {
        if (!editingItem) return
        const method = editingItem._id ? "PUT" : "POST"
        const res = await fetch("/api/testimonials", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingItem)
        })
        if (res.ok) {
            fetchItems()
            setIsDialogOpen(false)
            setEditingItem(null)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this testimonial?")) return
        await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" })
        fetchItems()
    }

    function openCreate() {
        setEditingItem(emptyItem)
        setIsDialogOpen(true)
    }

    function openEdit(item: Testimonial) {
        setEditingItem(item)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Testimonials</h1>
                <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
            </div>

            <div className="bg-white rounded-md border">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No testimonials yet.</div>
                ) : (
                    <ul className="divide-y">
                        {items.map((t) => (
                            <li key={t._id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                <div className="relative h-12 w-12 bg-gray-100 rounded-full overflow-hidden">
                                    {t.image ? <Image src={getImageUrl(t.image)} alt={t.name} fill sizes="48px" className="object-cover" /> : <ImageIcon className="h-full w-full text-gray-300 p-2" />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                                <div className="flex gap-0.5 text-yellow-500">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {t.isActive ? "Active" : "Inactive"}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id!)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem?._id ? "Edit" : "Add"} Testimonial</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role / Location</Label>
                                <Input value={editingItem.role} onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} placeholder="e.g. Homeowner, Harare" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Content</Label>
                                <Textarea value={editingItem.content} onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} rows={4} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rating (1-5)</Label>
                                <Input type="number" min={1} max={5} value={editingItem.rating} onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) || 5 })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Photo (optional)</Label>
                                <div className="flex items-center gap-4">
                                    {editingItem.image && (
                                        <div className="relative h-16 w-16 bg-gray-100 rounded-full overflow-hidden border">
                                            <Image src={getImageUrl(editingItem.image)} alt="Preview" fill sizes="64px" className="object-cover" />
                                        </div>
                                    )}
                                    <Button variant="outline" onClick={() => setShowMediaManager(true)}>
                                        <ImageIcon className="h-4 w-4 mr-2" /> Select Photo
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={editingItem.isActive} onCheckedChange={(v) => setEditingItem({ ...editingItem, isActive: v })} />
                                <Label>Active</Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MediaManager
                open={showMediaManager}
                onOpenChange={setShowMediaManager}
                onSelect={(item) => {
                    if (editingItem) setEditingItem({ ...editingItem, image: item.url })
                    setShowMediaManager(false)
                }}
            />
        </div>
    )
}
