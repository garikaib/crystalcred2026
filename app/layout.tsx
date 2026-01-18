import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminAwareLayout } from "@/components/layout/AdminAwareLayout";
import { GoogleAnalytics } from '@next/third-parties/google';
import { LocalTracker } from "@/components/analytics/LocalTracker";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://crystalcred.co.zw'),
  title: {
    default: "CrystalCred | Bridging the Gap to Clean Energy",
    template: "%s | CrystalCred"
  },
  description: "Premium solar energy solutions in Zimbabwe. Authorized distributors of top inverter and battery brands like Growatt, Deye, and Sunsynk.",
  keywords: ["solar energy", "zimbabwe", "inverters", "lithium batteries", "clean energy", "crystalcred", "growatt", "deye", "sunsynk"],
  authors: [{ name: "CrystalCred Team" }],
  creator: "CrystalCred",
  publisher: "CrystalCred",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/uploads/1768564583755-favicon.png",
    apple: "/uploads/1768564583755-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: "https://crystalcred.co.zw",
    siteName: "CrystalCred",
    title: "CrystalCred | Bridging the Gap to Clean Energy",
    description: "Premium solar energy solutions in Zimbabwe. Authorized distributors of top inverter and battery brands.",
    images: [
      {
        url: "/uploads/1768564583755-favicon.png", // Fallback OG image
        width: 800,
        height: 600,
        alt: "CrystalCred Solar Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrystalCred | Bridging the Gap to Clean Energy",
    description: "Premium solar energy solutions in Zimbabwe. Authorized distributors of top inverter and battery brands.",
    images: ["/uploads/1768564583755-favicon.png"],
    creator: "@crystalcred",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`} suppressHydrationWarning>
        <AdminAwareLayout>
          {children}
        </AdminAwareLayout>
        <GoogleAnalytics gaId="G-3XHN675BGF" />
        <Suspense fallback={null}>
          <LocalTracker />
        </Suspense>
      </body>
    </html>
  );
}
