import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import AnalyticsLog from "@/models/AnalyticsLog";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. Active Users (Last 30 mins)
        // Count unique visitor hashes
        const activeUsersCount = (await AnalyticsLog.distinct('visitorHash', {
            eventType: 'pageview',
            createdAt: { $gte: thirtyMinutesAgo }
        })).length;

        // 2. Page Views (Last 24h & 7d)
        const [views24h, views7d] = await Promise.all([
            AnalyticsLog.countDocuments({
                eventType: 'pageview',
                createdAt: { $gte: twentyFourHoursAgo }
            }),
            AnalyticsLog.countDocuments({
                eventType: 'pageview',
                createdAt: { $gte: sevenDaysAgo }
            })
        ]);

        // 3. Top Pages (Last 24h)
        const topPages = await AnalyticsLog.aggregate([
            { $match: { eventType: 'pageview', createdAt: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$url", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 4. Web Vitals (Last 7 days average)
        const vitalsStats = await AnalyticsLog.aggregate([
            { $match: { eventType: 'vitals', createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: "$vitals.name",
                    avgValue: { $avg: "$vitals.value" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const formatVital = (name: string, val: number) => {
            if (name === 'CLS') return val.toFixed(3);
            if (name === 'INP' || name === 'LCP' || name === 'FID' || name === 'FCP' || name === 'TTFB') return Math.round(val) + 'ms';
            return Math.round(val);
        };

        const vitals = vitalsStats.reduce((acc: any, curr: any) => {
            acc[curr._id] = formatVital(curr._id, curr.avgValue);
            return acc;
        }, {});

        return NextResponse.json({
            activeUsers: activeUsersCount,
            views24h,
            views7d,
            topPages: topPages.map(p => ({ url: p._id, count: p.count })),
            vitals
        });

    } catch (error: any) {
        console.error("Analytics Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
