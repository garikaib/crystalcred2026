"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/utils"

interface ProductCardProps {
    _id: string
    name: string
    slug?: string
    category: string
    price: string
    image: string
    description: string
    priority?: boolean
}

export function ProductCard({ _id, name, slug, category, price, image, description, priority }: ProductCardProps) {
    const productLink = slug ? `/shop/${slug}` : `/contact?product=${encodeURIComponent(name)}`
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full bg-gray-100">
                {image ? (
                    <Image
                        src={getImageUrl(image)}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={priority}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                        <span>No Image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
                    {category}
                </div>
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1" title={name}>{name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
                <p className="font-semibold text-primary">{price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full" variant="outline" asChild>
                    <Link href={productLink}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
