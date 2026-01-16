"use client"

import { motion } from "framer-motion"

const stats = [
    { label: "Years Experience", value: "8+" },
    { label: "Installations", value: "500+" },
    { label: "Happy Clients", value: "100%" },
    { label: "Power Generated", value: "1.2MW+" },
]

export function Stats() {
    return (
        <section className="py-12 bg-white -mt-10 relative z-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="text-center p-6 bg-secondary/30 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-muted-foreground font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
