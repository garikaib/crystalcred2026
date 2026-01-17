import mongoose from "mongoose"
import { GalleryItem } from "../models/GalleryItem"
import dbConnect from "../lib/mongodb"
import { ensureSafeToRun } from "./utils/safeguard"

ensureSafeToRun();

const galleryItems = [
    {
        title: "Large Scale Solar Farm",
        category: "Commercial",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop",
        description: "A 500kW solar installation for a manufacturing plant in Harare, reducing energy costs by 60%.",
        order: 1,
        featured: true,
    },
    {
        title: "Modern Residential Install",
        category: "Residential",
        image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop",
        description: "5kVA tailored home system with battery backup, ensuring 24/7 power availability.",
        order: 2,
        featured: true,
    },
    {
        title: "Agricultural Water Pumping",
        category: "Agricultural",
        image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2064&auto=format&fit=crop",
        description: "Solar-powered water pumping solution for a 50-hectare farm in Marondera.",
        order: 3,
        featured: true,
    },
    {
        title: "School Energy Project",
        category: "Other",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop",
        description: "Comprehensive solar solution for a local high school, powering classrooms and computer labs.",
        order: 4,
        featured: false,
    },
    {
        title: "Luxury Lodge Power System",
        category: "Commercial",
        image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2064&auto=format&fit=crop",
        description: "Off-grid power system for a remote safari lodge, focusing on reliability and silence.",
        order: 5,
        featured: false,
    },
    {
        title: "Urban Rooftop Solar",
        category: "Residential",
        image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=1974&auto=format&fit=crop",
        description: "Space-efficient rooftop installation for a suburban home in Bulawayo.",
        order: 6,
        featured: false,
    }
]

async function seedGallery() {
    try {
        await dbConnect()
        console.log("Connected to MongoDB")

        await GalleryItem.deleteMany({})
        console.log("Cleared existing gallery items")

        await GalleryItem.insertMany(galleryItems)
        console.log(`Seeded ${galleryItems.length} gallery items`)

        process.exit(0)
    } catch (error) {
        console.error("Error seeding gallery:", error)
        process.exit(1)
    }
}

seedGallery()
