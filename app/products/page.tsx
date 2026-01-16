import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Battery, Zap, Sun, Box, Sparkles, Shield, Clock } from "lucide-react"
import { CTASection } from "@/components/sections/CTASection"

const categories = [
    {
        icon: Box,
        name: "Solar Packages",
        slug: "solar-packages",
        description: "Complete turnkey solar systems for homes and businesses. 3kVA to 20kVA+.",
        gradient: "from-teal-500 to-cyan-400",
        image: "/uploads/seed-vzBm3YOs2po.webp",
    },
    {
        icon: Zap,
        name: "Inverters",
        slug: "inverters",
        description: "High-efficiency smart inverters from Growatt, Deye, Sunsynk, and Phocos.",
        gradient: "from-orange-500 to-amber-400",
        image: "/uploads/seed-41zwj6kfGmM.webp",
    },
    {
        icon: Battery,
        name: "Batteries",
        slug: "batteries",
        description: "Long-lasting lithium-ion and lead-acid batteries for reliable energy storage.",
        gradient: "from-violet-500 to-purple-400",
        image: "/uploads/seed-rSqrVKUOHY0.webp",
    },
    {
        icon: Sun,
        name: "Solar Panels",
        slug: "solar-panels",
        description: "Tier 1 monocrystalline solar panels with high efficiency and durability.",
        gradient: "from-emerald-500 to-green-400",
        image: "/uploads/seed-aZ4zaAGip9I.webp",
    },
]

const features = [
    {
        icon: Sparkles,
        title: "Premium Quality",
        description: "Only Tier 1 products from world-renowned manufacturers",
    },
    {
        icon: Shield,
        title: "Warranty Backed",
        description: "Up to 25 years warranty on panels, 10 years on inverters",
    },
    {
        icon: Clock,
        title: "Fast Installation",
        description: "Professional installation within 48-72 hours of order",
    },
]

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 gradient-hero" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full">
                        🌞 Premium Solar Solutions
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Power Your Future with
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                            Clean Energy
                        </span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        We supply and install only the best quality solar equipment from world-renowned manufacturers.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-primary bg-white rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                        >
                            Browse Shop <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/50 rounded-full hover:bg-white/10 transition-all"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 justify-center md:justify-start">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Explore Our Categories
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From complete solar packages to individual components, we have everything you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {categories.map((category) => (
                            <Link href={`/products/${category.slug}`} key={category.slug} className="group">
                                <div className="relative h-80 rounded-3xl overflow-hidden shadow-premium hover-lift">
                                    {/* Background Image */}
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80`} />
                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                                <category.icon className="h-6 w-6" />
                                            </div>
                                            <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                        <p className="text-white/90">{category.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 gradient-dark text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-2">500+</div>
                            <div className="text-white/70">Systems Installed</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-2">25yr</div>
                            <div className="text-white/70">Panel Warranty</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300 mb-2">98%</div>
                            <div className="text-white/70">Customer Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">24/7</div>
                            <div className="text-white/70">Support Available</div>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    )
}
