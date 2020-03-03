import { createApiUrl, requestGet, IResponseItems } from './next-lib'
import { IPage } from './types'

export type QuerySlice = {
    skip: number
    limit: number
    sortBy: string
}

export async function getPagesByTags(tags: string[], { skip, limit, sortBy }: QuerySlice) {
    const tagQuery = tags
        .map(x => `tag=${x}`)
        .join('&')

    const url = `/api/pages/tags?${tagQuery}&skip=${skip}&limit=${limit}&sortBy=${sortBy}`
    const res = await requestGet<IResponseItems<IPage>>(createApiUrl(url), null)

    return res?.items
}

export async function getPagesCardsByTags(tags: string[]) {
    const skip = 0
    const limit = 1000

    return getPagesByTags(tags, { skip, limit, sortBy: '-date' })
}
