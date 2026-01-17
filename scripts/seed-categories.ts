import * as dotenv from "dotenv";
import { resolve } from "path";
import { ensureSafeToRun } from "./utils/safeguard";

ensureSafeToRun();
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const DEFAULT_CATEGORIES = [
    { name: "General", slug: "general" },
    { name: "Solar Tips", slug: "solar-tips" },
    { name: "Industry News", slug: "industry-news" },
    { name: "Projects", slug: "projects" },
];

async function seedCategories() {
    try {
        // Dynamic import to ensure process.env is populated before lib/mongodb runs
        const dbConnect = (await import("../lib/mongodb")).default;
        const Category = (await import("../models/Category")).default;

        await dbConnect();
        console.log("Connected to MongoDB for seeding...");

        for (const cat of DEFAULT_CATEGORIES) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`Created category: ${cat.name}`);
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seedCategories();
