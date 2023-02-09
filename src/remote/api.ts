import { apiGet } from "@/next-lib"
import { createHomeCards, createMenu, createPage, createPageUrls } from "@/remote/factory"
import { IMenu, IPage, PageCardDto } from "@/types"

const backendUrl = "https://hudozka.tmshv.com"

export async function getUrls(): Promise<string[]> {
    let urls: string[] = []
    const limit = 100
    let start = 0
    while (true) {
        const url = `${backendUrl}/pages?_limit=${limit}&_start=${start}`
        const res = await apiGet(createPageUrls)(url, () => ({ items: [] }))
        if (!res || res.items.length === 0) {
            break
        }

        start += limit
        urls = [...urls, ...res.items]
    }

    return urls
}

export async function getPageBySlug(slug: string): Promise<IPage | null> {
    const url = `${backendUrl}/pages?slug=${slug}`
    const page = await apiGet(createPage)(url, () => null)
    if (!page) {
        return null
    }
    return page
}

export async function getHomeCards(): Promise<PageCardDto[]> {
    const items = await apiGet(createHomeCards)(`${backendUrl}/home`, async () => [])
    return items
}

export async function getMenu(): Promise<IMenu[]> {
    const menu = await apiGet(createMenu)(`${backendUrl}/menu`, () => [])
    return menu
}

