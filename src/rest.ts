import { createApiUrl, requestGet, IResponseItems } from './next-lib'
import { IPage, PageCardData } from './types'
import { queryList } from './lib/url'

export type QuerySlice = {
    skip: number
    limit: number
    sortBy: string
    fields?: string[]
}

export async function getPagesByTags<T = IPage>(tags: string[], { skip, limit, sortBy, fields }: QuerySlice) {
    const tag = queryList('tag', tags)
    const field = queryList('field', fields ?? [])

    const url = `/api/pages/tags?${tag}&${field}&skip=${skip}&limit=${limit}&sortBy=${sortBy}`
    const res = await requestGet<IResponseItems<T>>(createApiUrl(url), null)

    return res?.items
}

export async function getPagesCardsByTags(tags: string[]): Promise<PageCardData[]> {
    type ResponseItem = {
        url: string
        title: string
        featured: boolean
        date: string
        coverSrc: string
    }

    const skip = 0
    const limit = 1000
    const fields = [
        'url',
        'title',
        'featured',
        'date',
        'coverSrc'
    ]

    const items = await getPagesByTags<ResponseItem>(tags, { fields, skip, limit, sortBy: '-date' })
    if (!Array.isArray(items)) {
        return []
    }

    return items.map(item => ({
        url: item.url,
        title: item.title,
        featured: item.featured,
        date: new Date(item.date),
        coverSrc: item.coverSrc,
    }))
}
