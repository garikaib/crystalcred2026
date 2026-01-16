import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Users, Target, Lightbulb, ArrowRight, ShieldCheck } from "lucide-react"
import { CTASection } from "@/components/sections/CTASection"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="container relative z-10 mx-auto px-4 text-center text-white">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                        Established 2021
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">About CrystalCred</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Leading the renewable energy revolution in Zimbabwe with premium solar solutions and a commitment to excellence.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-premium-lg group">
                            <Image
                                src="/uploads/seed-41zwj6kfGmM.webp" // Using one of our seeded images
                                alt="CrystalCred Solar Installation"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <div className="text-3xl font-bold mb-2">Our Mission</div>
                                <p className="text-white/90">Powering Zimbabwe's Future</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase mb-2 block">Our Story</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                                Bridging the Gap to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Clean Energy</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                Founded with a vision to effectively bridge the gap to clean energy, CrystalCred has grown to become a trusted name in Zimbabwe's solar industry. We started as a small team of passionate engineers and have expanded to serve hundreds of households and businesses across the nation.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                We believe that reliable electricity shouldn't be a luxury. By partnering with world-class manufacturers and training local talent, we deliver systems that stand the test of time, ensuring energy independence for our clients.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-teal-50 rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">3+</div>
                                    <div className="text-sm text-muted-foreground">Years Experience</div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl">
                                    <div className="text-3xl font-bold text-orange-500 mb-1">100%</div>
                                    <div className="text-sm text-muted-foreground">Project Success</div>
                                </div>
                            </div>

                            <Button size="lg" className="bg-primary hover:bg-teal-700 text-white rounded-full px-8" asChild>
                                <Link href="/contact">
                                    Work With Us <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose CrystalCred?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our commitment to quality and customer satisfaction sets us apart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Authorized Distributors",
                                desc: "We source directly from manufacturers like Growatt, ensuring genuine products and valid warranties.",
                                color: "text-teal-600",
                                bg: "bg-teal-50"
                            },
                            {
                                icon: Users,
                                title: "Certified Installers",
                                desc: "Our team consists of qualified engineers and technicians adhering to strict ZERA safety standards.",
                                color: "text-orange-600",
                                bg: "bg-orange-50"
                            },
                            {
                                icon: Target,
                                title: "Premium Support",
                                desc: "We don't just install and leave. We offer comprehensive after-sales support and system monitoring.",
                                color: "text-purple-600",
                                bg: "bg-purple-50"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-premium hover-lift border border-gray-100">
                                <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6`}>
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-teal-900 to-teal-800 p-10 rounded-3xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Target size={120} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <span className="p-2 bg-white/10 rounded-lg"><Target className="w-6 h-6" /></span>
                                Our Mission
                            </h3>
                            <p className="text-teal-50 text-lg leading-relaxed relative z-10">
                                To provide accessible, reliable, and affordable renewable energy solutions that empower communities and drive sustainable development in Zimbabwe.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-10 rounded-3xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Lightbulb size={120} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <span className="p-2 bg-white/10 rounded-lg"><Lightbulb className="w-6 h-6" /></span>
                                Our Vision
                            </h3>
                            <p className="text-orange-50 text-lg leading-relaxed relative z-10">
                                To be the premier provider of clean energy solutions in Southern Africa, recognized for innovation, quality, and exceptional customer service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    )
}
