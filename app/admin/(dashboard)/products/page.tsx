"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Loader2, Search, Filter } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { MediaManager } from "@/components/admin/MediaManager"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
    _id?: string
    name: string
    slug: string
    category: string
    image: string
    price: string
    description: string
    badge?: string
    isFeatured: boolean
    isBestSeller: boolean
    isBestValue: boolean
    order: number
    isActive: boolean
}

const CATEGORIES = [
    { name: "Solar Packages", slug: "solar-packages" },
    { name: "Inverters", slug: "inverters" },
    { name: "Batteries", slug: "batteries" },
    { name: "Solar Panels", slug: "solar-panels" },
]

export default function AdminProductsPage() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showMediaManager, setShowMediaManager] = useState(false)

    // Filters
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const emptyProduct: Product = {
        name: "",
        slug: "",
        category: "solar-packages",
        image: "",
        price: "",
        description: "",
        badge: "",
        isFeatured: false,
        isBestSeller: false,
        isBestValue: false,
        order: 0,
        isActive: true,
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const res = await fetch("/api/products?active=false")
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.error("Failed to fetch products", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave() {
        if (!editingProduct) return
        setIsSaving(true)

        try {
            const method = editingProduct._id ? "PUT" : "POST"
            const res = await fetch("/api/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            })

            if (res.ok) {
                await fetchProducts()
                setShowEditDialog(false)
                setEditingProduct(null)
            }
        } catch (error) {
            console.error("Failed to save product", error)
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setProducts(prev => prev.filter(p => p._id !== id))
            }
        } catch (error) {
            console.error("Failed to delete product", error)
        }
    }

    function openEdit(product: Product) {
        setEditingProduct({ ...product })
        setShowEditDialog(true)
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage all products, packages, and their home page features.</p>
                </div>
                <Button onClick={() => openEdit(emptyProduct)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <ul className="divide-y">
                    {filteredProducts.map((p) => (
                        <li key={p._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 group">
                            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {p.image ? (
                                    <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />
                                ) : (
                                    <ImageIcon className="h-full w-full text-gray-300 p-4" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-lg truncate">{p.name}</div>
                                <div className="text-sm text-medium text-primary uppercase font-bold tracking-wider">{p.category}</div>
                                <div className="flex gap-2 mt-1">
                                    {p.isFeatured && (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded ring-1 ring-yellow-200">FEATURED</span>
                                    )}
                                    {p.isBestSeller && (
                                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded ring-1 ring-green-200">BEST SELLER</span>
                                    )}
                                    {p.isBestValue && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded ring-1 ring-blue-200">BEST VALUE</span>
                                    )}
                                </div>
                            </div>
                            <div className="font-bold text-lg text-ring mr-4">{p.price}</div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id!)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    ))}
                    {filteredProducts.length === 0 && (
                        <li className="p-8 text-center text-muted-foreground">No products found for the current criteria.</li>
                    )}
                </ul>
            </div>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct?._id ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            {editingProduct?._id ? "Make changes to the product details below." : "Enter the details for the new product."}
                        </DialogDescription>
                    </DialogHeader>

                    {editingProduct && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        placeholder="e.g. Growatt SPF 5000ES"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={editingProduct.category}
                                        onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug (optional)</Label>
                                    <Input
                                        value={editingProduct.slug}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                                        placeholder="auto-generated from name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price Display</Label>
                                    <Input
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        placeholder="e.g. $750 or Inquire for Price"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    placeholder="Detailed product specifications or highlights..."
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Product Image</Label>
                                <div className="flex items-center gap-4">
                                    {editingProduct.image && (
                                        <div className="relative h-24 w-24 bg-gray-100 rounded overflow-hidden border">
                                            <Image src={editingProduct.image} alt="Preview" fill sizes="96px" className="object-cover" />
                                        </div>
                                    )}
                                    <Button variant="outline" onClick={() => setShowMediaManager(true)}>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        {editingProduct.image ? "Change Image" : "Select Image"}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Featured on Home</Label>
                                            <p className="text-[10px] text-muted-foreground">Show in homepage sections</p>
                                        </div>
                                        <Switch
                                            checked={editingProduct.isFeatured}
                                            onCheckedChange={(v) => setEditingProduct({ ...editingProduct, isFeatured: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Active Status</Label>
                                            <p className="text-[10px] text-muted-foreground">Visible on public site</p>
                                        </div>
                                        <Switch
                                            checked={editingProduct.isActive}
                                            onCheckedChange={(v) => setEditingProduct({ ...editingProduct, isActive: v })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Best Seller</Label>
                                            <p className="text-[10px] text-muted-foreground">Shows "Best Seller" badge</p>
                                        </div>
                                        <Switch
                                            checked={editingProduct.isBestSeller}
                                            onCheckedChange={(v) => setEditingProduct({ ...editingProduct, isBestSeller: v })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Best Value</Label>
                                            <p className="text-[10px] text-muted-foreground">Shows "Best Value" badge</p>
                                        </div>
                                        <Switch
                                            checked={editingProduct.isBestValue}
                                            onCheckedChange={(v) => setEditingProduct({ ...editingProduct, isBestValue: v })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingProduct?._id ? "Update Product" : "Create Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MediaManager
                open={showMediaManager}
                onOpenChange={setShowMediaManager}
                onSelect={(item: any) => {
                    if (editingProduct) {
                        setEditingProduct({ ...editingProduct, image: item.url })
                    }
                    setShowMediaManager(false)
                }}
            />
        </div>
    )
}
