import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminBar } from "@/components/admin/AdminBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrystalCred | Bridging the Gap to Clean Energy",
  description: "Premium solar energy solutions in Zimbabwe. Authorized distributors of top inverter and battery brands.",
  icons: {
    icon: "/uploads/1768564583755-favicon.png",
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
        <AuthProvider>
          <AdminBar />
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
