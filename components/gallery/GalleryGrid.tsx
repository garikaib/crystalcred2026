"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"

// Placeholder images - in real app would use actual project images
const images = [
    { src: "/resources/solar-roof-1.jpg", alt: "Residential Installation" },
    { src: "/resources/inverter-setup.jpg", alt: "Inverter Setup" },
    { src: "/resources/commercial-solar.jpg", alt: "Commercial Project" },
    { src: "/resources/solar-pump.jpg", alt: "Solar Pump System" },
    { src: "/resources/battery-bank.jpg", alt: "Battery Bank" },
    { src: "/resources/roof-install.jpg", alt: "Roof Installation" },
]

export function GalleryGrid() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-100"
                        onClick={() => setSelectedImage(img.src)}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span>Project Image {index + 1}</span>
                        </div>
                        {/* <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            /> */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium border border-white px-4 py-2 rounded-full">View Project</span>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                    <div className="relative h-[80vh] w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20"
                        >
                            <X size={24} />
                        </button>
                        {selectedImage && (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                {/* Image Placeholder in Lightbox */}
                                <span>Image View: {selectedImage}</span>
                            </div>
                            // <Image
                            //   src={selectedImage}
                            //   alt="Gallery Image"
                            //   fill
                            //   className="object-contain"
                            // />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
