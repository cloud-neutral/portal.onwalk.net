import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/_media/',
        },
        sitemap: 'https://www.onwalk.net/sitemap.xml',
    }
}
