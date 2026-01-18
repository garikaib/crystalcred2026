import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Phone, Mail, CheckCircle, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CTASection } from "@/components/sections/CTASection"
import dbConnect from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        return {
            title: "Product Not Found | CrystalCred",
        }
    }

    return {
        title: `${product.name} | CrystalCred Solar Shop`,
        description: product.description.slice(0, 160) + "...",
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160) + "...",
            images: product.image ? [product.image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description.slice(0, 160) + "...",
            images: product.image ? [product.image] : [],
        },
    }
}

interface PageProps {
    params: Promise<{ slug: string }>
}

async function getProductBySlug(slug: string) {
    await dbConnect()
    const product = await Product.findOne({ slug, isActive: true }).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
}

async function getRelatedProducts(category: string, excludeSlug: string) {
    await dbConnect()
    const products = await Product.find({
        category,
        slug: { $ne: excludeSlug },
        isActive: true
    }).limit(4).lean()
    return JSON.parse(JSON.stringify(products))
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.category, slug)

    const categoryName = product.category.split('-').map((word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/shop" className="hover:text-primary flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" /> Shop
                        </Link>
                        <span>/</span>
                        <Link href={`/products/${product.category}`} className="hover:text-primary">
                            {categoryName}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Detail */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="relative">
                            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                                {product.image ? (
                                    <Image
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                        <span className="text-2xl">No Image</span>
                                    </div>
                                )}
                            </div>
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isBestSeller && (
                                    <Badge className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1">
                                        <TrendingUp className="h-3 w-3 mr-1" /> Best Seller
                                    </Badge>
                                )}
                                {product.isBestValue && (
                                    <Badge className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1">
                                        <Award className="h-3 w-3 mr-1" /> Best Value
                                    </Badge>
                                )}
                                {product.isFeatured && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-sm px-3 py-1">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                                {categoryName}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {product.name}
                            </h1>
                            <div className="text-4xl font-bold text-primary mb-6">
                                {product.price}
                            </div>

                            <div className="prose prose-gray max-w-none mb-8">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                <h3 className="font-semibold text-lg mb-4">What's Included</h3>
                                <ul className="space-y-3">
                                    {product.description.split('.').filter((s: string) => s.trim()).slice(0, 5).map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{item.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="flex-1 text-lg py-6" asChild>
                                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
                                        <Phone className="mr-2 h-5 w-5" /> Get a Quote
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="flex-1 text-lg py-6" asChild>
                                    <Link href="mailto:info@crystalcred.co.zw">
                                        <Mail className="mr-2 h-5 w-5" /> Email Us
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-8 border-t grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primary">5+</div>
                                    <div className="text-xs text-muted-foreground">Years Warranty</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">100%</div>
                                    <div className="text-xs text-muted-foreground">Genuine Products</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">24/7</div>
                                    <div className="text-xs text-muted-foreground">Support Available</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((related: any) => (
                                <Card key={related._id} className="overflow-hidden group hover:shadow-lg transition-all">
                                    <Link href={`/shop/${related.slug}`}>
                                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                                            {related.image ? (
                                                <Image
                                                    src={getImageUrl(related.image)}
                                                    alt={related.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                                            <Link href={`/shop/${related.slug}`}>{related.name}</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="font-bold text-primary">{related.price}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CTASection />
        </div>
    )
}
