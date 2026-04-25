import type { MetadataRoute } from "next"
import { siteUrl } from "@/const"
import { getAllTagSlugs, getUrls } from "@/remote/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [urls, tagSlugs] = await Promise.all([getUrls(), getAllTagSlugs()])

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            changeFrequency: "daily",
        },
        {
            url: `${siteUrl}/collective`,
            changeFrequency: "daily",
        },
        {
            url: `${siteUrl}/tags`,
            changeFrequency: "weekly",
        },
    ]

    const dynamicPages: MetadataRoute.Sitemap = urls.map(path => ({
        url: `${siteUrl}${path}`,
        changeFrequency: "daily",
    }))

    const tagPages: MetadataRoute.Sitemap = tagSlugs.map(slug => ({
        url: `${siteUrl}/tags/${slug}`,
        changeFrequency: "weekly",
    }))

    return [...staticPages, ...dynamicPages, ...tagPages]
}
