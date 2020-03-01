import { encodeImage, ImageDto } from './image'
import Page from '../core/Page'
import { Breadcrumb } from '../types'
import { Tag } from '../core/Tag'

type Token = {
    token: string
    data: any
}

type PageDto = {
    id: string
    title: string
    date?: string
    url: string
    data: string
    description: string
    preview?: ImageDto
    tokens: Token[]
    tags: Tag[]
    breadcrumb: Breadcrumb
}

export function encodePage(page: Page, breadcrumb: Breadcrumb): PageDto {
    const preview = page.preview ? encodeImage(page.preview) : null
    const date = page.date ? page.date.toString() : null

    return {
        id: page.id,
        title: page.title,
        url: page.url,
        data: page.data,
        description: page.description,
        tokens: page.tokens,
        tags: page.tags,
        preview,
        date,
        breadcrumb,
    }
}
