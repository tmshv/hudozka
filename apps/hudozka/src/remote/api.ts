import { menu } from "@/const"
import type { BreadcrumbPart, FeedPage, Page, PageCardDto, Tag, TagListing } from "@/types"
import type { DocV1Block } from "./doc"
import { createFeedPages, createHomeCards, createPage, createTag, createTagPageCards } from "./factory"
import { pb } from "./pb"
import type { PbFile, PbHomeData, PbImage, PbPage, PbTag } from "./types"

const MAX_PARENT_DEPTH = 10

function getParentId(parent: string | string[] | undefined): string | undefined {
    if (!parent) return undefined
    if (Array.isArray(parent)) return parent[0]
    return parent
}

async function fetchParentChain(startId: string | undefined): Promise<PbPage[]> {
    if (!startId) return []
    const chain: PbPage[] = []
    const visited = new Set<string>()
    let currentId: string | undefined = startId
    while (currentId && chain.length < MAX_PARENT_DEPTH) {
        if (visited.has(currentId)) break
        visited.add(currentId)
        try {
            const parent = await pb.collection("pages").getOne<PbPage>(currentId)
            chain.unshift(parent)
            currentId = getParentId(parent.parent)
        } catch {
            break
        }
    }
    return chain
}

function buildBreadcrumb(record: PbPage, parents: PbPage[]): BreadcrumbPart[] {
    if (parents.length === 0) return []
    const home: BreadcrumbPart = { name: menu[0].name, href: "/" }
    const ancestors: BreadcrumbPart[] = parents.map(p => ({ name: p.title, href: p.slug }))
    const current: BreadcrumbPart = { name: record.title, href: record.slug }
    return [home, ...ancestors, current]
}

function buildIdFilter(ids: string[]): string {
    return ids.map(id => `id="${id}"`).join(" || ")
}

async function fetchImagesByIds(ids: string[]): Promise<Map<string, PbImage>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("images").getFullList<PbImage>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchFilesByIds(ids: string[]): Promise<Map<string, PbFile>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("files").getFullList<PbFile>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchPagesByIds(ids: string[]): Promise<Map<string, PbPage>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("pages").getFullList<PbPage>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchTagsByIds(ids: string[]): Promise<PbTag[]> {
    if (ids.length === 0) return []
    return pb.collection("tags").getFullList<PbTag>({
        filter: buildIdFilter(ids),
    })
}

function collectBlockRefs(blocks: DocV1Block[]) {
    const imageIds = new Set<string>()
    const fileIds = new Set<string>()
    const pageIds = new Set<string>()

    for (const block of blocks) {
        switch (block.type) {
            case "image":
                imageIds.add(block.image)
                break
            case "document":
                fileIds.add(block.file)
                break
            case "card-grid":
                for (const item of block.items) {
                    pageIds.add(item.page)
                }
                break
        }
    }

    return { imageIds, fileIds, pageIds }
}

export async function getUrls(): Promise<string[]> {
    try {
        const records = await pb.collection("pages").getFullList<PbPage>({
            fields: "slug",
            filter: "draft=false",
        })
        return records.map(r => r.slug)
    } catch (error) {
        console.error(`Failed to fetch URLs: ${error}`)
        return []
    }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    try {
        const record = await pb.collection("pages").getFirstListItem<PbPage>(`slug="${slug}"`)

        // Collect all referenced IDs from blocks
        const refs = collectBlockRefs(record.doc.blocks)

        // Include cover image ID
        if (record.cover) {
            refs.imageIds.add(record.cover)
        }

        // Round 2: fetch images, files, tags, card-grid pages, parent chain in parallel
        const [images, files, tags, cardGridPages, parentChain] = await Promise.all([
            fetchImagesByIds([...refs.imageIds]),
            fetchFilesByIds([...refs.fileIds]),
            fetchTagsByIds(record.tags),
            fetchPagesByIds([...refs.pageIds]),
            fetchParentChain(getParentId(record.parent)),
        ])

        // Round 3: fetch cover images for card-grid pages
        const cardGridCoverIds = new Set<string>()
        for (const page of cardGridPages.values()) {
            if (page.cover && !images.has(page.cover)) {
                cardGridCoverIds.add(page.cover)
            }
        }
        const cardGridImages =
            cardGridCoverIds.size > 0 ? await fetchImagesByIds([...cardGridCoverIds]) : new Map<string, PbImage>()

        // Merge all images for card-grid covers
        const allCardGridImages = new Map([...images, ...cardGridImages])

        const breadcrumb = buildBreadcrumb(record, parentChain)
        return createPage(record, images, files, tags, cardGridPages, allCardGridImages, breadcrumb)
    } catch (error) {
        console.error(`Failed to fetch page: ${error}`)
        return null
    }
}

export async function getHomeCards(): Promise<PageCardDto[]> {
    try {
        const kv = await pb.collection("kv").getFirstListItem<{ data: PbHomeData }>('key="home"')
        const data = kv.data
        if (!data.cards || data.cards.length === 0) return []

        const pageIds = data.cards.map(c => c.page)
        const pages = await fetchPagesByIds(pageIds)

        const coverIds = [...pages.values()].map(p => p.cover).filter(Boolean)
        const images = await fetchImagesByIds(coverIds)

        return createHomeCards(data, pages, images)
    } catch (error) {
        console.error(`Failed to fetch home cards: ${error}`)
        return []
    }
}

export async function getRecentPages(limit: number = 30): Promise<FeedPage[]> {
    try {
        const result = await pb.collection("pages").getList<PbPage>(1, limit, {
            filter: "date!='' && draft=false",
            sort: "-date",
        })
        return createFeedPages(result.items)
    } catch (error) {
        console.error(`Failed to fetch recent pages: ${error}`)
        return []
    }
}

export async function getAllTagSlugs(): Promise<string[]> {
    const tags = await getAllTagsWithCounts()
    return tags.map(t => t.slug)
}

export async function getPagesByTag(slug: string, page: number, perPage: number): Promise<TagListing | null> {
    try {
        const tag = await pb.collection("tags").getFirstListItem<PbTag>(`slug="${slug}"`)

        const result = await pb.collection("pages").getList<PbPage>(page, perPage, {
            filter: `tags ~ "${tag.id}" && draft=false`,
            sort: "-updated",
            fields: "id,slug,title,cover,updated,date",
        })

        const coverIds = result.items.map(p => p.cover).filter(Boolean)
        const images = await fetchImagesByIds(coverIds)

        return {
            tag: createTag(tag, result.totalItems),
            items: createTagPageCards(result.items, images),
            total: result.totalItems,
            page,
            perPage,
        }
    } catch (error) {
        console.error(`Failed to fetch pages by tag "${slug}": ${error}`)
        return null
    }
}

export async function getAllTagsWithCounts(): Promise<Tag[]> {
    try {
        const [pages, tags] = await Promise.all([
            pb.collection("pages").getFullList<{ tags: string[] }>({
                filter: "draft=false",
                fields: "tags",
            }),
            pb.collection("tags").getFullList<PbTag>(),
        ])

        const counts = new Map<string, number>()
        for (const p of pages) {
            for (const tagId of p.tags) {
                counts.set(tagId, (counts.get(tagId) ?? 0) + 1)
            }
        }

        return tags
            .map(t => createTag(t, counts.get(t.id) ?? 0))
            .filter(t => t.count > 0)
            .sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count
                return a.name.localeCompare(b.name, "ru")
            })
    } catch (error) {
        console.error(`Failed to fetch tags with counts: ${error}`)
        return []
    }
}
