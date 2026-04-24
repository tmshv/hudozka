import { NextResponse } from "next/server"
import { siteUrl } from "@/const"
import { getRecentPages } from "@/remote/api"

export async function GET() {
    const pages = await getRecentPages()

    const feed = {
        version: "https://jsonfeed.org/version/1.1",
        title: "Шлиссельбургская ДХШ",
        home_page_url: siteUrl,
        feed_url: `${siteUrl}/feed.json`,
        items: pages.map((page) => ({
            id: `${siteUrl}${page.url}`,
            url: `${siteUrl}${page.url}`,
            title: page.title,
            date_published: new Date(page.date).toISOString(),
            summary: page.excerpt,
        })),
    }

    return NextResponse.json(feed)
}
