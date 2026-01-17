"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryItem {
    _id: string
    title: string
    category: string
    image: string
    description: string
}

const CATEGORIES = ["All", "Residential", "Commercial", "Industrial", "Agricultural", "Other"]

export function GalleryGrid() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchGallery() {
            try {
                const res = await fetch("/api/gallery")
                if (res.ok) {
                    const data = await res.json()
                    setItems(data)
                    setFilteredItems(data)
                }
            } catch (error) {
                console.error("Failed to fetch gallery:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchGallery()
    }, [])

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredItems(items)
        } else {
            setFilteredItems(items.filter(item => item.category === selectedCategory))
        }
    }, [selectedCategory, items])

    return (
        <div className="space-y-8">
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-6 transition-all ${selectedCategory === category
                            ? "bg-primary text-white shadow-md"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                            }`}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedItem(item)}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority={items.indexOf(item) < 4}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="text-sm font-medium text-primary-foreground mb-1 bg-primary/90 rounded-full px-3 py-1 w-fit">
                                        {item.category}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    <ZoomIn size={24} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            No projects found in this category.
                        </div>
                    )}
                </div>
            )}

            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-none text-white">
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {selectedItem && (
                        <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                            <div className="relative flex-1 bg-black">
                                <Image
                                    src={selectedItem.image}
                                    alt={selectedItem.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="w-full md:w-96 bg-gray-900 p-8 flex flex-col justify-center overflow-y-auto">
                                <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium w-fit mb-4">
                                    {selectedItem.category}
                                </span>
                                <h2 className="text-2xl font-bold mb-4">{selectedItem.title}</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    {selectedItem.description}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
