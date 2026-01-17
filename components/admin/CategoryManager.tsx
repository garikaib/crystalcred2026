"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Category {
    _id: string
    name: string
    slug: string
}

interface CategoryManagerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCategoriesChange?: () => void
}

export function CategoryManager({ open, onOpenChange, onCategoriesChange }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [idToDelete, setIdToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/categories")
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            console.error("Failed to fetch categories", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (open) {
            fetchCategories()
        }
    }, [open])

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
    }

    const handleCreate = async () => {
        if (!newName.trim()) return
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    slug: generateSlug(newName)
                })
            })

            if (res.ok) {
                setNewName("")
                fetchCategories()
                onCategoriesChange?.()
                toast({ title: "Category created" })
            } else {
                const err = await res.text()
                toast({ title: "Error", description: err, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to create category", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    slug: generateSlug(editName)
                })
            })

            if (res.ok) {
                setEditingId(null)
                fetchCategories()
                onCategoriesChange?.()
                toast({ title: "Category updated" })
            } else {
                const err = await res.text()
                toast({ title: "Error", description: err, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update category", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!idToDelete) return
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/categories/${idToDelete}`, {
                method: "DELETE"
            })

            if (res.ok) {
                fetchCategories()
                onCategoriesChange?.()
                toast({ title: "Category deleted" })
                setIdToDelete(null)
            } else {
                const err = await res.text()
                toast({ title: "Error", description: err, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete category", variant: "destructive" })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Categories</DialogTitle>
                    <DialogDescription>
                        Create, edit or remove blog categories. You cannot delete categories that are currently being used by articles.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 mb-6 p-4 bg-teal-50/30 rounded-lg border border-teal-100">
                    <Input
                        placeholder="New category name..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        className="bg-white border-teal-100 focus:ring-teal-200"
                    />
                    <Button onClick={handleCreate} disabled={isSubmitting || !newName.trim()} className="bg-teal-600 hover:bg-teal-700">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add Category
                    </Button>
                </div>

                <div className="flex-grow overflow-auto border rounded-xl shadow-sm bg-white">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="font-bold text-gray-700">Name</TableHead>
                                <TableHead className="font-bold text-gray-700">Slug</TableHead>
                                <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell className="font-medium">
                                            {editingId === cat._id ? (
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="h-8"
                                                    autoFocus
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs font-mono">
                                            {editingId === cat._id ? generateSlug(editName) : cat.slug}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {editingId === cat._id ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600"
                                                            onClick={() => handleUpdate(cat._id)}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => {
                                                                setEditingId(cat._id)
                                                                setEditName(cat.name)
                                                            }}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => setIdToDelete(cat._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>

            <AlertDialog open={!!idToDelete} onOpenChange={(open) => !open && setIdToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You can only delete categories that are not attached to any articles.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleConfirmDelete()
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    )
}
