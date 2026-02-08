import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { App } from "@/components/App"
import { PageContent } from "@/components/PageContent"
import { MetaBuilder, buildMetadata } from "@/lib/meta"
import { getMenu, getPageBySlug, getUrls } from "@/remote/api"
import { tail } from "@/lib/array"

export const revalidate = 30
export const dynamicParams = true

export async function generateStaticParams() {
    const urls = await getUrls()
    return urls.map(path => ({
        slug: tail(path.split("/")),
    }))
}

type Props = {
    params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const slugPath = `/${slug.join("/")}`
    const page = await getPageBySlug(slugPath)
    if (!page) {
        return {}
    }

    const m = new MetaBuilder()
        .setImage(page.cover)
        .setTitle(page.title)
        .setDescription(page.description ?? undefined)
        .build()
    return buildMetadata(m)
}

export default async function SlugPage({ params }: Props) {
    const { slug } = await params
    const slugPath = `/${slug.join("/")}`
    const page = await getPageBySlug(slugPath)
    if (!page) {
        notFound()
    }

    const breadcrumbSize = page.breadcrumb?.length ?? 0
    const breadcrumbs = breadcrumbSize < 2 ? [] : page.breadcrumb ?? []

    return (
        <App
            contentStyle={{
                marginTop: "var(--size-l)",
                marginBottom: "var(--size-xl)",
            }}
            breadcrumbs={breadcrumbs}
        >
            <PageContent
                tags={page.tags}
                date={page.date}
                tokens={page.tokens}
                documentSignature={{
                    date: "20.01.2021г.",
                    person: "Тимашева Марина Геннадьевна",
                    position: "Директор",
                    signature: "0ac4ea89753a4ba9893799442325fb41",
                }}
            />
        </App>
    )
}
