import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { Product } from '@/models/Product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://crystalcred.co.zw'

    await dbConnect()
    let posts: any[] = []
    let products: any[] = []

    try {
        [posts, products] = await Promise.all([
            BlogPost.find({ status: 'published' }).select('slug updatedAt').lean(),
            Product.find({ isActive: true }).select('slug updatedAt').lean()
        ])
    } catch (e) {
        console.error("Sitemap fetch error", e)
    }

    const blogUrls = posts.map((post: any) => ({
        url: `${baseUrl}/knowledge/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const routes = [
        '',
        '/about',
        '/products',
        '/services',
        '/knowledge',
        '/gallery',
        '/contact',
        '/shop',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes, ...blogUrls, ...productUrls]
}
