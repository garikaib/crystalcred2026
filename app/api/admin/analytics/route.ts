import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Check for Credentials
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newline chars in env
        const propertyId = process.env.GOOGLE_PROPERTY_ID;

        if (!clientEmail || !privateKey || !propertyId) {
            return NextResponse.json({
                status: "setup_required",
                message: "Missing Google Analytics Credentials",
                missing: {
                    email: !clientEmail,
                    key: !privateKey,
                    propertyId: !propertyId
                }
            }, { status: 400 });
        }

        // 2. Initialize Client
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        // 3. Fetch Data (Active Users, Screen Page Views, Sessions)
        // Last 7 days
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                //{ name: 'date' }, // Optional time series
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
                { name: 'sessions' },
            ],
        });

        const row = response.rows?.[0];
        const data = {
            activeUsers: row?.metricValues?.[0]?.value || "0",
            screenPageViews: row?.metricValues?.[1]?.value || "0",
            sessions: row?.metricValues?.[2]?.value || "0",
        };

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({
            error: "Failed to fetch analytics",
            details: error.message
        }, { status: 500 });
    }
}
