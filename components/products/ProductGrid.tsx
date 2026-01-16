import { ProductCard } from "./ProductCard"

interface ProductGridProps {
    products: Array<{
        _id: string
        name: string
        slug?: string
        category: string
        price: string
        image: string
        description: string
    }>
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <ProductCard key={product._id} {...product} priority={index < 4} />
            ))}
        </div>
    )
}
