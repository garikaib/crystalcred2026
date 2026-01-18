import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Corrected import
import "./globals.css";
import { AdminAwareLayout } from "@/components/layout/AdminAwareLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://next.crystalcred.co.zw'),
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
    url: "https://next.crystalcred.co.zw",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col" suppressHydrationWarning>
        <AdminAwareLayout>
          {children}
        </AdminAwareLayout>
      </body>
    </html>
  );
}
