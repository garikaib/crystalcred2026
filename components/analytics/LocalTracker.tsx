"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { useSession } from "next-auth/react";

export function LocalTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { status } = useSession();
    const lastUrl = useRef<string | null>(null);

    // Track Page Views
    useEffect(() => {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

        // Prevent duplicate tracking on initial load if React 18 fires twice in dev
        if (lastUrl.current === url) return;
        lastUrl.current = url;

        // Fire and forget
        fetch("/api/analytics/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventType: "pageview",
                url
            }),
            keepalive: true,
        }).catch(err => console.error("Tracking Error", err));

    }, [pathname, searchParams]);

    // Track Web Vitals (LCP, FID, CLS, INP, FCP, TTFB)
    useReportWebVitals((metric) => {
        // Only report critical vitals to reduce noise
        if (['LCP', 'CLS', 'INP'].includes(metric.name)) {
            fetch("/api/analytics/collect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType: "vitals",
                    url: window.location.pathname,
                    vitals: {
                        name: metric.name,
                        value: metric.value,
                        rating: metric.rating
                    }
                }),
                keepalive: true,
            }).catch(err => console.error("Vitals Error", err));
        }
    });

    return null;
}
