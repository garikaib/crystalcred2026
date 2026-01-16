"use client"

import { Zap, Wrench, BarChart, Truck } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const services = [
    {
        title: "Consultations & Design",
        description: "Expert site assessments and custom solar system design tailored to your energy needs.",
        icon: BarChart,
    },
    {
        title: "Professional Installation",
        description: "Certified installation of residential, commercial, and industrial solar systems.",
        icon: Zap,
    },
    {
        title: "Supply & Distribution",
        description: "Authorized specialized equipment sales including top-tier inverters and batteries.",
        icon: Truck,
    },
    {
        title: "Maintenance & Repairs",
        description: "Comprehensive after-sales support, system monitoring, and repair services.",
        icon: Wrench,
    },
]

export function Services() {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Comprehensive solar energy solutions from initial consultation to lifelong maintenance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-full bg-secondary text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <service.icon size={24} />
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base leading-relaxed">
                                    {service.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
