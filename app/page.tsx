import type { Metadata } from "next"
import { App } from "@/components/App"
import { HomeContent } from "@/components/HomeContent"
import { MetaBuilder, buildMetadata } from "@/lib/meta"
import { getHomeCards } from "@/remote/api"

export const revalidate = 30

export async function generateMetadata(): Promise<Metadata> {
    const title = "Шлиссельбургская ДХШ"
    const m = new MetaBuilder()
        .setTitle(title)
        .setData({ url: "/" })
        .build()
    return buildMetadata(m)
}

export default async function HomePage() {
    const items = await getHomeCards()

    return (
        <App showAuthor>
            <HomeContent items={items} />
        </App>
    )
}
