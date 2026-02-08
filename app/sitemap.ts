import type { MetadataRoute } from "next"
import { siteUrl } from "@/const"
import { getUrls } from "@/remote/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urls = await getUrls()

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            changeFrequency: "daily",
        },
        {
            url: `${siteUrl}/collective`,
            changeFrequency: "daily",
        },
    ]

    const dynamicPages: MetadataRoute.Sitemap = urls.map((path) => ({
        url: `${siteUrl}${path}`,
        changeFrequency: "daily",
    }))

    return [...staticPages, ...dynamicPages]
}
