import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://iemsa.nycu.site',
            lastModified: new Date(),
        }, {
            url: 'https://iemsa.nycu.site/about',
            lastModified: new Date(),
        }, {
            url: 'https://iemsa.nycu.site/articles',
            lastModified: new Date(),
        }, {
            url: 'https://iemsa.nycu.site/activities',
            lastModified: new Date(),
        }, {
            url: 'https://iemsa.nycu.site/docs',
            lastModified: new Date(),
        }
    ]
}