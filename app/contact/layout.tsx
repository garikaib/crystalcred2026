import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with CrystalCred for solar consultations, quotes, or support. We're here to help you transition to clean energy.",
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
