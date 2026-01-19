"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LocalTracker } from "./LocalTracker";
import { Suspense } from "react";

/**
 * AnalyticsWrapper handles the conditional loading of all tracking scripts.
 * It ensures that:
 * 1. Tracking is disabled for authenticated users (admins/staff).
 * 2. Tracking is disabled on admin routes.
 * 3. Tracking scripts are loaded efficiently.
 */
export function AnalyticsWrapper() {
    const pathname = usePathname();
    const { status } = useSession();

    // 1. Skip all tracking for admin pages
    if (pathname?.startsWith("/admin")) return null;

    // 2. Skip all tracking for authenticated users
    if (status === "authenticated") return null;

    return (
        <>
            {/* 
                Google Analytics 
                Note: @next/third-parties doesn't support 'strategy' prop directly yet in many versions,
                but keeping it inside this conditional wrapper already provides significant 1st-party JS savings 
                for admins and handles the "Privacy" concern.
            */}
            <GoogleAnalytics gaId="G-3XHN675BGF" />

            <Suspense fallback={null}>
                <LocalTracker />
            </Suspense>
        </>
    );
}
