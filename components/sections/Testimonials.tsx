"use client"

import { useState, useEffect } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Loader2 } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"

interface Testimonial {
    _id: string
    name: string
    role: string
    content: string
    rating: number
    image?: string
}

export function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch("/api/testimonials")
                if (res.ok) setTestimonials(await res.json())
            } catch (error) {
                console.error("Failed to fetch testimonials", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTestimonials()
    }, [])

    if (isLoading) {
        return (
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </section>
        )
    }

    if (testimonials.length === 0) return null

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                        {testimonials.map((t, index) => (
                            <CarouselItem key={t._id} className="md:basis-1/2 lg:basis-1/2 pl-4">
                                <div className="p-1">
                                    <Card className="h-full border-none shadow-sm hover:shadow-md bg-secondary/20">
                                        <CardContent className="flex flex-col gap-4 p-6">
                                            <div className="flex gap-1 text-yellow-500">
                                                {[...Array(t.rating)].map((_, i) => (
                                                    <Star key={i} size={18} fill="currentColor" />
                                                ))}
                                            </div>
                                            <blockquote className="text-lg leading-relaxed italic text-muted-foreground">
                                                "{t.content}"
                                            </blockquote>
                                            <div className="mt-auto pt-4 flex items-center gap-3">
                                                {t.image && (
                                                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                                        <Image
                                                            src={getImageUrl(t.image)}
                                                            alt={t.name}
                                                            fill
                                                            sizes="40px"
                                                            className="object-cover"
                                                            priority={index < 2}
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-foreground">{t.name}</div>
                                                    <div className="text-sm text-muted-foreground">{t.role}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    )
}
