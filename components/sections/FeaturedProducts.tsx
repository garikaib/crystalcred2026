"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageUrl } from "@/lib/utils"

interface Product {
    _id: string
    name: string
    category: string
    image: string
    price: string
    badge?: string
}

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products?featured=true")
                if (res.ok) setProducts(await res.json())
            } catch (error) {
                console.error("Failed to fetch featured products", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </section>
        )
    }

    if (products.length === 0) return null

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
                        <p className="text-muted-foreground max-w-xl">
                            Discover our most popular solar solutions, curated for performance and reliability.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/products">
                            View All Products <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <Card key={product._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                {product.image ? (
                                    <Image
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        priority={index < 2}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                        <span>No Image</span>
                                    </div>
                                )}
                                {product.badge && (
                                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                        {product.badge}
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {product.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="font-semibold text-emerald-700">{product.price}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-secondary text-primary hover:bg-primary hover:text-white" asChild>
                                    <Link href={`/products/${product.category.toLowerCase().replace(' ', '-')}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" asChild>
                        <Link href="/products">
                            View All Products <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
