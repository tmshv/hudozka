import { Title } from "@hudozka/ui"
import type { Metadata } from "next"
import { App } from "@/components/App"
import { TagsIndex } from "@/components/TagsIndex"
import { menu } from "@/const"
import { buildMetadata, MetaBuilder } from "@/lib/meta"
import { getAllTagsWithCounts } from "@/remote/api"

export const revalidate = 30

export async function generateMetadata(): Promise<Metadata> {
    const meta = new MetaBuilder().setTitle("Метки").setDescription("Список всех меток сайта.").build()
    return buildMetadata(meta)
}

export default async function TagsIndexPage() {
    const tags = await getAllTagsWithCounts()

    const breadcrumbs = [
        { name: menu[0].name, href: "/" },
        { name: "Метки", href: "/tags" },
    ]

    return (
        <App
            contentStyle={{
                marginTop: "var(--size-l)",
                marginBottom: "var(--size-xl)",
            }}
            breadcrumbs={breadcrumbs}
        >
            <Title level={1}>Метки</Title>
            <TagsIndex items={tags} />
        </App>
    )
}
