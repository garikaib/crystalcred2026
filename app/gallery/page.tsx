import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { CTASection } from "@/components/sections/CTASection"

export default function GalleryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-secondary/30 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Projects</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore our portfolio of successful solar installations across Zimbabwe.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <GalleryGrid />
                </div>
            </section>

            <CTASection />
        </div>
    )
}
