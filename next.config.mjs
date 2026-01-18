import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },

            {
                protocol: "https",
                hostname: "crystalcred.co.zw",
            },
        ],
    },
    serverExternalPackages: ["mongoose", "sharp"],
};

export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "mbare-prices",
    project: "crystal-cred",
}, {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from visitors
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
});
