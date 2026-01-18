import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Solar Shop",
    description: "Shop for top-quality solar panels, inverters, and batteries in Zimbabwe. Premium products from Growatt, Deye, and Sunsynk.",
}

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
