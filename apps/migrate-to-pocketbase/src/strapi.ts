export type StrapiMediaObject = {
    url: string
    name: string
    hash: string
    ext: string
    mime: string
    width: number
    height: number
    size: number
}

export type StrapiMedia = StrapiMediaObject & {
    id: number
    alternativeText: string | null
    caption: string | null
    formats: null | {
        thumbnail: StrapiMediaObject
        large: StrapiMediaObject
        medium: StrapiMediaObject
        small: StrapiMediaObject
    }
}

export type StrapiComponentText = {
    __component: "hudozka.text"
    id: number
    text: string
}

export type StrapiComponentImage = {
    __component: "hudozka.image"
    id: number
    wide: boolean
    caption: string
    media: StrapiMedia
}

export type StrapiComponentDocument = {
    __component: "hudozka.document"
    id: number
    title: string
    media: StrapiMediaObject & { id: number }
}

export type StrapiComponentEmbed = {
    __component: "hudozka.embed"
    id: number
    src: string
}

export type StrapiComponentCardGrid = {
    __component: "hudozka.card-grid"
    id: number
    items: StrapiPageCard[]
}

export type StrapiComponent =
    | StrapiComponentText
    | StrapiComponentImage
    | StrapiComponentDocument
    | StrapiComponentEmbed
    | StrapiComponentCardGrid

export type StrapiTag = {
    id: number
    slug: string
    name: string
}

export type StrapiPage = {
    id: number
    title: string
    excerpt: string
    slug: string
    date: string | null
    cover?: StrapiMedia
    published_at: string
    created_at: string
    updated_at: string
    content: StrapiComponent[]
    tags: StrapiTag[]
}

export type StrapiPageCard = {
    __component: "hudozka.page-card"
    id: number
    page: StrapiPage
    layout: "small" | "medium" | "big"
}

export type StrapiHome = {
    id: number
    title: string
    cards: StrapiPageCard[]
}

export type StrapiMenu = {
    id: number
    homeLabel: string
    menu: StrapiComponentCardGrid
}

async function get<T>(base: string, path: string): Promise<T> {
    const res = await fetch(`${base}${path}`)
    if (!res.ok) {
        throw new Error(`GET ${path} -> ${res.status}`)
    }
    return (await res.json()) as T
}

export async function fetchAllPages(base: string): Promise<StrapiPage[]> {
    const limit = 100
    let start = 0
    const all: StrapiPage[] = []
    while (true) {
        const batch = await get<StrapiPage[]>(base, `/pages?_limit=${limit}&_start=${start}`)
        if (batch.length === 0) {
            break
        }
        all.push(...batch)
        start += limit
    }
    return all
}

export async function fetchTags(base: string): Promise<StrapiTag[]> {
    return await get<StrapiTag[]>(base, "/tags")
}

export async function fetchHome(base: string): Promise<StrapiHome> {
    return await get<StrapiHome>(base, "/home")
}

export async function fetchMenu(base: string): Promise<StrapiMenu> {
    return await get<StrapiMenu>(base, "/menu")
}
