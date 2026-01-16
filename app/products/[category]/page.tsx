import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CTASection } from "@/components/sections/CTASection"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Button } from "@/components/ui/button"

// Fetch products by category from the API
async function getProductsByCategory(category: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/products?category=${category}`, { cache: 'no-store' })
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        console.error("Failed to fetch products", error)
        return []
    }
}

interface PageProps {
    params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
    const { category: categorySlug } = await params
    const products = await getProductsByCategory(categorySlug)

    const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-secondary/30 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/products" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                <ChevronLeft size={16} /> Back to Products
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-4">{categoryName}</h1>
                    <p className="text-xl text-muted-foreground">
                        Creating sustainable energy independence.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-xl">No products found in this category provided.</p>
                            <Button asChild className="mt-4" variant="outline">
                                <Link href="/contact">Contact Us for Custom Orders</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <CTASection />
        </div>
    )
}
