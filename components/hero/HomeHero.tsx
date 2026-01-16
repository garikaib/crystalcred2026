"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Phone, Play, Sparkles } from "lucide-react"

export function HomeHero() {
    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center">
            {/* Background with Gradient */}
            <div className="absolute inset-0 gradient-hero" />

            {/* Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="container relative z-10 px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <Sparkles className="h-4 w-4 text-amber-300" />
                            <span className="text-sm font-medium text-white">Zimbabwe's Trusted Solar Partner</span>
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Power Your Future with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300">
                                Clean Energy
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                            Premium solar solutions for homes and businesses. We provide reliable, cost-effective energy with authorized distribution of top-tier products.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-full hover:from-orange-600 hover:to-amber-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <Phone className="h-5 w-5" /> Get a Free Quote
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/50 rounded-full hover:bg-white/10 transition-all"
                            >
                                View Products <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">500+</div>
                                <div className="text-sm text-white/60">Systems Installed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">25yr</div>
                                <div className="text-sm text-white/60">Warranty</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">98%</div>
                                <div className="text-sm text-white/60">Satisfaction</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            {/* Floating Cards */}
                            <div className="absolute top-0 right-0 glass rounded-2xl p-6 shadow-xl">
                                <div className="text-4xl font-bold text-white mb-1">30%</div>
                                <div className="text-sm text-white/80">Energy Savings</div>
                            </div>
                            <div className="absolute bottom-10 left-0 glass rounded-2xl p-6 shadow-xl">
                                <div className="text-4xl font-bold text-amber-300 mb-1">24/7</div>
                                <div className="text-sm text-white/80">Support Available</div>
                            </div>

                            {/* Central Circle */}
                            <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-400/30 to-teal-400/30 flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Play className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L1440 120L1440 0C1440 0 1200 80 720 80C240 80 0 0 0 0L0 120Z" fill="white" />
                </svg>
            </div>
        </section>
    )
}
