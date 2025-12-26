import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Country from '@/models/Country'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Static routes
    const routes = [
        '',
        '/login',
        '/country',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        await dbConnect()
        const countries = await Country.find({}, 'slug updatedAt').lean()

        const countryRoutes = countries.map((country: any) => ({
            url: `${baseUrl}/country/${country.slug}`,
            lastModified: country.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...routes, ...countryRoutes]
    } catch (error) {
        console.error('Sitemap generation error:', error)
        return routes
    }
}
