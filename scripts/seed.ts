import { config } from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local from the project root (one level up from scripts/)
config({ path: path.resolve(__dirname, "../.env.local") })

const featuredProducts = [
    {
        name: "5kVA Gold Package",
        category: "Solar Packages",
        image: "/resources/5kva-system.jpg",
        price: "From $3,500",
        badge: "Best Seller",
        order: 1,
        isActive: true,
    },
    {
        name: "Growatt 5000ES",
        category: "Inverters",
        image: "/resources/growatt-inverter.jpg",
        price: "Inquire for Price",
        badge: "",
        order: 2,
        isActive: true,
    },
    {
        name: "Pylontech US3000C",
        category: "Batteries",
        image: "/resources/pylontech-battery.jpg",
        price: "Inquire for Price",
        badge: "",
        order: 3,
        isActive: true,
    },
    {
        name: "JA Solar 550W Panel",
        category: "Solar Panels",
        image: "/resources/solar-panel.jpg",
        price: "Inquire for Price",
        badge: "",
        order: 4,
        isActive: true,
    },
]

const testimonials = [
    {
        name: "Tafadzwa M.",
        role: "Homeowner, Harare",
        content: "CrystalCred transformed our home energy. The 5kVA system they installed works perfectly, and we haven't worried about ZESA cuts since!",
        rating: 5,
        image: "",
        order: 1,
        isActive: true,
    },
    {
        name: "Sarah K.",
        role: "Business Owner, Bulawayo",
        content: "Professional service from start to finish. The team explained everything clearly and the installation was neat and tidy.",
        rating: 5,
        image: "",
        order: 2,
        isActive: true,
    },
    {
        name: "Blessing C.",
        role: "Farm Manager",
        content: "We installed a solar pump system for our irrigation. It's been a game changer for our crop yield. Highly recommend CrystalCred.",
        rating: 5,
        image: "",
        order: 3,
        isActive: true,
    },
]

async function seed() {
    // Dynamic imports to ensure config() has run
    const dbConnect = (await import("../lib/mongodb")).default
    const { Product } = await import("../models/Product")
    const { Testimonial } = await import("../models/Testimonial")

    console.log("Connecting to database...")
    await dbConnect()

    console.log("Seeding Products...")
    const existingProducts = await Product.countDocuments()
    if (existingProducts === 0) {
        // Need to adapt the old seed data if we were to run this, 
        // but for now just fix the reference.
        // await Product.insertMany(featuredProducts) 
    }

    console.log("Seeding Testimonials...")
    const existingTestimonials = await Testimonial.countDocuments()
    if (existingTestimonials === 0) {
        await Testimonial.insertMany(testimonials)
        console.log(`Inserted ${testimonials.length} testimonials.`)
    } else {
        console.log(`Skipped: ${existingTestimonials} testimonials already exist.`)
    }

    console.log("Seeding complete!")
    process.exit(0)
}

seed().catch((err) => {
    console.error("Seeding failed:", err)
    process.exit(1)
})
