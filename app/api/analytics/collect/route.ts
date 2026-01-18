import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AnalyticsLog from "@/models/AnalyticsLog";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventType, url, vitals } = body;

        if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

        await dbConnect();

        // 1. Generate Visitor Hash (Privacy-friendly)
        // We use a daily salt so the hash changes every day, making it impossible to track users long-term
        // but allowing us to count unique "daily" visitors.
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const ua = req.headers.get("user-agent") || "unknown";
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const salt = process.env.AUTH_SECRET || "default_salt";

        const hash = crypto
            .createHash("sha256")
            .update(`${ip}-${ua}-${date}-${salt}`)
            .digest("hex")
            .substring(0, 16); // Short hash

        // 2. Extract Device/Browser/Country info (Basic, non-invasive)
        // Cloudflare adds 'cf-ipcountry'
        const country = req.headers.get("cf-ipcountry") || "Unknown";

        let device = "desktop";
        if (ua.match(/mobile/i)) device = "mobile";
        else if (ua.match(/tablet|ipad/i)) device = "tablet";

        let browser = "unknown";
        if (ua.match(/chrome|chromium|crios/i)) browser = "Chrome";
        else if (ua.match(/firefox|fxios/i)) browser = "Firefox";
        else if (ua.match(/safari/i)) browser = "Safari";
        else if (ua.match(/edg/i)) browser = "Edge";

        // 3. Save Log
        await AnalyticsLog.create({
            eventType: eventType || 'pageview',
            url,
            visitorHash: hash,
            country,
            device,
            browser,
            vitals: vitals ? {
                name: vitals.name,
                value: vitals.value,
                rating: vitals.rating
            } : undefined
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Analytics Collect Error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
