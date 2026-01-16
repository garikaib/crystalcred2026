import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://next.crystalcred.co.zw'

    // Fetch blog posts
    await dbConnect()
    let posts: any[] = []
    try {
        posts = await BlogPost.find({ status: 'published' }).select('slug updatedAt').lean()
    } catch (e) {
        console.error("Sitemap fetch error", e)
    }

    const blogUrls = posts.map((post: any) => ({
        url: `${baseUrl}/knowledge/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const routes = [
        '',
        '/about',
        '/products',
        '/services',
        '/knowledge',
        '/gallery',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes, ...blogUrls]
}
