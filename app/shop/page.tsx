"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, SlidersHorizontal, ChevronDown, Loader2, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface Product {
    _id: string
    name: string
    slug: string
    category: string
    image: string
    price: string
    description: string
    isFeatured: boolean
    isBestSeller: boolean
    isBestValue: boolean
}

const CATEGORIES = [
    { name: "All Categories", slug: "all" },
    { name: "Solar Packages", slug: "solar-packages" },
    { name: "Inverters", slug: "inverters" },
    { name: "Batteries", slug: "batteries" },
    { name: "Solar Panels", slug: "solar-panels" },
]

const SORT_OPTIONS = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Best Sellers", value: "best-seller" },
]

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [showBestSellers, setShowBestSellers] = useState(false)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products")
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
        fetchProducts()
    }, [])

    const filteredProducts = useMemo(() => {
        let result = [...products]

        // Search filter
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Category filter
        if (categoryFilter !== "all") {
            result = result.filter(p => p.category === categoryFilter)
        }

        // Best sellers filter
        if (showBestSellers) {
            result = result.filter(p => p.isBestSeller)
        }

        // Sorting
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => {
                    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0
                    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0
                    return priceA - priceB
                })
                break
            case "price-desc":
                result.sort((a, b) => {
                    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0
                    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0
                    return priceB - priceA
                })
                break
            case "best-seller":
                result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
                break
            default: // newest
                break
        }

        return result
    }, [products, searchQuery, categoryFilter, sortBy, showBestSellers])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-primary py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Explore our complete range of solar solutions, from residential packages to commercial systems.
                    </p>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-8">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full lg:w-[200px] bg-white">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full lg:w-[200px] bg-white">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {SORT_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Best Sellers Toggle */}
                        <Button
                            variant={showBestSellers ? "default" : "outline"}
                            onClick={() => setShowBestSellers(!showBestSellers)}
                            className="gap-2"
                        >
                            <TrendingUp className="h-4 w-4" />
                            Best Sellers
                        </Button>
                    </div>

                    {/* Results Count */}
                    <p className="text-muted-foreground mb-6">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white">
                                    <Link href={`/shop/${product.slug}`}>
                                        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 flex gap-2">
                                                {product.isBestSeller && (
                                                    <Badge className="bg-green-500 hover:bg-green-600">Best Seller</Badge>
                                                )}
                                                {product.isBestValue && (
                                                    <Badge className="bg-blue-500 hover:bg-blue-600">Best Value</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <CardHeader className="p-4 pb-2">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                            {CATEGORIES.find(c => c.slug === product.category)?.name || product.category}
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                                        <p className="font-bold text-xl text-primary">{product.price}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button className="w-full" variant="outline" asChild>
                                            <Link href={`/shop/${product.slug}`}>View Details</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-muted-foreground mb-4">No products found matching your criteria.</p>
                            <Button variant="outline" onClick={() => {
                                setSearchQuery("")
                                setCategoryFilter("all")
                                setShowBestSellers(false)
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
