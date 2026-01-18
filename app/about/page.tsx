import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Users, Target, Lightbulb, ArrowRight, ShieldCheck } from "lucide-react"
import { CTASection } from "@/components/sections/CTASection"
import { Button } from "@/components/ui/button"
import Page from "@/models/Page"
import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about CrystalCred's mission to bridge the gap to clean energy in Zimbabwe. Our story, values, and vision for a sustainable future.",
};

// Map icons to strings from JSON
const iconMap: Record<string, any> = {
    ShieldCheck: ShieldCheck,
    Users: Users,
    Target: Target,
    Lightbulb: Lightbulb
};

export default async function AboutPage() {
    await dbConnect();
    const page = await Page.findOne({ slug: "about", isActive: true });

    if (!page) {
        // Fallback or 404. Since we seeded, this strictly shouldn't happen unless db is cleared.
        // We will just render nothing or redirect. But let's show 404 if content missing.
        // Or we could hardcode the fallback here to be safe.
        // For now, let's assume seed worked.
        notFound();
    }

    const { hero, story, values, missionVision } = page.sections;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="container relative z-10 mx-auto px-4 text-center text-white">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                        {hero.badge}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{hero.title}</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        {hero.description}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-premium-lg group">
                            <Image
                                src={story.image}
                                alt="CrystalCred Solar Installation"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <div className="text-3xl font-bold mb-2">{story.overlayTitle}</div>
                                <p className="text-white/90">{story.overlaySubtitle}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase mb-2 block">{story.sectionTitle}</span>
                            {/* We can parsed the mainHeading to find the highlighted part if we want, or simple render full string */
                            /* For simplicity now, rendering full string without gradient split unless we add a specific field for it */
                            /* Or we can use regex to wrap 'Clean Energy' if present. Let's keep it simple string for now. */}
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                                {story.mainHeading}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                {story.paragraph1}
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                {story.paragraph2}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-teal-50 rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">{story.stats.experience}</div>
                                    <div className="text-sm text-muted-foreground">{story.stats.experienceLabel}</div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl">
                                    <div className="text-3xl font-bold text-orange-500 mb-1">{story.stats.success}</div>
                                    <div className="text-sm text-muted-foreground">{story.stats.successLabel}</div>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{values.heading}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {values.subheading}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.items.map((item: any, i: number) => {
                            const Icon = iconMap[item.icon] || ShieldCheck;
                            // Simple color cycling based on index
                            const colors = [
                                { color: "text-teal-600", bg: "bg-teal-50" },
                                { color: "text-orange-600", bg: "bg-orange-50" },
                                { color: "text-purple-600", bg: "bg-purple-50" }
                            ];
                            const style = colors[i % colors.length];

                            return (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-premium hover-lift border border-gray-100">
                                    <div className={`w-14 h-14 ${style.bg} rounded-xl flex items-center justify-center mb-6`}>
                                        <Icon className={`w-7 h-7 ${style.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                </div>
                            )
                        })}
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
                                {missionVision.mission.title}
                            </h3>
                            <p className="text-teal-50 text-lg leading-relaxed relative z-10">
                                {missionVision.mission.description}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-10 rounded-3xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Lightbulb size={120} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <span className="p-2 bg-white/10 rounded-lg"><Lightbulb className="w-6 h-6" /></span>
                                {missionVision.vision.title}
                            </h3>
                            <p className="text-orange-50 text-lg leading-relaxed relative z-10">
                                {missionVision.vision.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    )
}
