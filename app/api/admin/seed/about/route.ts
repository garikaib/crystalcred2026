import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET() {
    try {
        await dbConnect();

        const aboutContent = {
            hero: {
                badge: "Established 2021",
                title: "About CrystalCred",
                description: "Leading the renewable energy revolution in Zimbabwe with premium solar solutions and a commitment to excellence."
            },
            story: {
                image: "/uploads/seed-41zwj6kfGmM.webp",
                overlayTitle: "Our Mission",
                overlaySubtitle: "Powering Zimbabwe's Future",
                sectionTitle: "Our Story",
                mainHeading: "Bridging the Gap to Clean Energy",
                paragraph1: "Founded with a vision to effectively bridge the gap to clean energy, CrystalCred has grown to become a trusted name in Zimbabwe's solar industry. We started as a small team of passionate engineers and have expanded to serve hundreds of households and businesses across the nation.",
                paragraph2: "We believe that reliable electricity shouldn't be a luxury. By partnering with world-class manufacturers and training local talent, we deliver systems that stand the test of time, ensuring energy independence for our clients.",
                stats: {
                    experience: "3+",
                    experienceLabel: "Years Experience",
                    success: "100%",
                    successLabel: "Project Success"
                }
            },
            values: {
                heading: "Why Choose CrystalCred?",
                subheading: "Our commitment to quality and customer satisfaction sets us apart.",
                items: [
                    {
                        title: "Authorized Distributors",
                        description: "We source directly from manufacturers like Growatt, ensuring genuine products and valid warranties.",
                        icon: "ShieldCheck" // Identifier for frontend mapping
                    },
                    {
                        title: "Certified Installers",
                        description: "Our team consists of qualified engineers and technicians adhering to strict ZERA safety standards.",
                        icon: "Users"
                    },
                    {
                        title: "Premium Support",
                        description: "We don't just install and leave. We offer comprehensive after-sales support and system monitoring.",
                        icon: "Target"
                    }
                ]
            },
            missionVision: {
                mission: {
                    title: "Our Mission",
                    description: "To provide accessible, reliable, and affordable renewable energy solutions that empower communities and drive sustainable development in Zimbabwe."
                },
                vision: {
                    title: "Our Vision",
                    description: "To be the premier provider of clean energy solutions in Southern Africa, recognized for innovation, quality, and exceptional customer service."
                }
            }
        };

        const page = await Page.findOneAndUpdate(
            { slug: "about" },
            {
                title: "About Us",
                slug: "about",
                sections: aboutContent,
                isActive: true
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, page });

    } catch (error) {
        console.error("Seeding Error:", error);
        return new NextResponse("Failed to seed", { status: 500 });
    }
}
