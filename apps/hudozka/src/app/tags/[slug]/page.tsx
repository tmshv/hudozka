import { Title } from "@hudozka/ui"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { App } from "@/components/App"
import { PageGrid } from "@/components/PageGrid"
import { Pagination } from "@/components/Pagination"
import { menu } from "@/const"
import { buildMetadata, MetaBuilder } from "@/lib/meta"
import { getAllTagSlugs, getPagesByTag } from "@/remote/api"

export const revalidate = 30
export const dynamicParams = true

const PER_PAGE = 24

export async function generateStaticParams() {
    const slugs = await getAllTagSlugs()
    return slugs.map(slug => ({ slug }))
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ page?: string }>
}

function parsePage(value: string | undefined): number {
    const n = Number.parseInt(value ?? "1", 10)
    return Number.isFinite(n) && n >= 1 ? n : 1
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params
    const sp = await searchParams
    const page = parsePage(sp.page)

    const listing = await getPagesByTag(slug, page, PER_PAGE)
    if (!listing) {
        return {}
    }

    const titleBase = `${listing.tag.name} — метка`
    const title = page > 1 ? `${titleBase}, страница ${page}` : titleBase

    const meta = new MetaBuilder().setTitle(title).setDescription(`Записи с меткой «${listing.tag.name}».`).build()

    const metadata = buildMetadata(meta)
    if (page > 1) {
        return { ...metadata, robots: { index: false, follow: true } }
    }
    return metadata
}

export default async function TagPage({ params, searchParams }: Props) {
    const { slug } = await params
    const sp = await searchParams
    const page = parsePage(sp.page)

    const listing = await getPagesByTag(slug, page, PER_PAGE)
    if (!listing) {
        notFound()
    }

    const totalPages = Math.max(1, Math.ceil(listing.total / listing.perPage))
    if (listing.total > 0 && page > totalPages) {
        notFound()
    }

    const breadcrumbs = [
        { name: menu[0].name, href: "/" },
        { name: "Метки", href: "/tags" },
        { name: listing.tag.name, href: listing.tag.href },
    ]

    return (
        <App
            contentStyle={{
                marginTop: "var(--size-l)",
                marginBottom: "var(--size-xl)",
            }}
            breadcrumbs={breadcrumbs}
        >
            <Title level={1}>{listing.tag.name}</Title>
            {listing.items.length === 0 ? (
                <p>Пока нет записей.</p>
            ) : (
                <>
                    <PageGrid items={listing.items} />
                    <Pagination
                        basePath={listing.tag.href}
                        page={listing.page}
                        total={listing.total}
                        perPage={listing.perPage}
                    />
                </>
            )}
        </App>
    )
}
