"use client"

import Link from "next/link"
import { ArrowRight, Phone, Sparkles } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 animate-gradient" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium text-white">Free Consultation Available</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
                    Ready to Switch to
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                        Clean Energy?
                    </span>
                </h2>

                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                    Get a free consultation and quote today. Start saving on energy costs with CrystalCred.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-white text-teal-700 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <Phone className="h-5 w-5" /> Request a Quote
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/50 rounded-full hover:bg-white/10 transition-all"
                    >
                        Learn More About Us <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
