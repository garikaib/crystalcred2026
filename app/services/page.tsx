import Link from "next/link"
import { CTASection } from "@/components/sections/CTASection"
import { Zap, ShieldCheck, Ruler, Truck, ArrowRight, CheckCircle2, Phone } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Our Services",
    description: "Expert solar services in Zimbabwe, including site assessment, professional installation, product supply, and ongoing maintenance.",
};

const services = [
    {
        icon: Ruler,
        title: "Site Assessment & Design",
        description: "Every successful solar project starts with a proper plan. We conduct detailed site inspections to analyze your load requirements, roof orientation, and shading.",
        features: ["Load analysis", "Roof assessment", "Custom system design", "ROI projection"],
        gradient: "from-teal-500 to-cyan-400",
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
    {
        icon: Zap,
        title: "Installation & Commissioning",
        description: "Our certified technicians handle the entire installation process with precision and care, ensuring compliance with all safety standards.",
        features: ["Professional installation", "System testing", "ZERA compliance", "User training"],
        gradient: "from-orange-500 to-amber-400",
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
    {
        icon: Truck,
        title: "Product Supply",
        description: "As authorized distributors, we supply genuine solar panels, inverters, and lithium batteries from leading global brands.",
        features: ["Authentic products", "Competitive pricing", "Bulk discounts", "Fast delivery"],
        gradient: "from-violet-500 to-purple-400",
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        icon: ShieldCheck,
        title: "Maintenance & Support",
        description: "We offer cleaning, health checks, and firmware updates to keep your system performing at its peak.",
        features: ["24/7 support", "Regular maintenance", "System monitoring", "Warranty claims"],
        gradient: "from-emerald-500 to-green-400",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
]

const processSteps = [
    { number: "01", title: "Consultation", description: "Free initial consultation to understand your needs" },
    { number: "02", title: "Site Survey", description: "Professional assessment of your property" },
    { number: "03", title: "Proposal", description: "Detailed quote with system recommendations" },
    { number: "04", title: "Installation", description: "Professional installation within 48-72 hours" },
]

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 gradient-dark" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.3),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(13,148,136,0.3),transparent_50%)]" />
                </div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        ⚡ End-to-End Solutions
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Expert Solar Services
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                            From Design to Delivery
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                        Complete solar energy solutions tailored to your specific needs and budget.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-400 text-white rounded-full hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Phone className="h-5 w-5" /> Book Consultation
                    </Link>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            What We Offer
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive services to ensure your solar journey is seamless and successful.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group relative rounded-3xl overflow-hidden shadow-premium hover-lift bg-white border border-gray-100"
                            >
                                {/* Gradient Top Bar */}
                                <div className={`h-2 bg-gradient-to-r ${service.gradient}`} />

                                <div className="p-8">
                                    <div className={`inline-flex p-4 rounded-2xl ${service.bg} mb-6`}>
                                        <service.icon className={`h-8 w-8 ${service.color}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-foreground mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        {service.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center gap-2">
                                                <CheckCircle2 className={`h-4 w-4 ${service.color}`} />
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Simple steps to energy independence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {processSteps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                <div className="mb-4">
                                    <span className="inline-block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm">{step.description}</p>

                                {index < processSteps.length - 1 && (
                                    <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Banner */}
            <section className="py-12 gradient-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xl font-medium mb-4">
                        Trusted by 500+ homes and businesses across Zimbabwe
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-80">
                        <span className="text-lg">Growatt</span>
                        <span className="text-lg">Sunsynk</span>
                        <span className="text-lg">Deye</span>
                        <span className="text-lg">Pylontech</span>
                        <span className="text-lg">JA Solar</span>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    )
}
