
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
    try {
        await dbConnect();

        // Revalidate every hour
        // In Next.js App Router, caching behavior is different, but we can set headers if needed.
        // simpler to just fetch. 

        let settings = await SiteSettings.findOne();

        if (!settings) {
            // Return defaults if nothing in DB yet (though admin likely visited first)
            settings = new SiteSettings();
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[PUBLIC_SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
