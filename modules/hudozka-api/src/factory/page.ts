import { encodeImage, ImageDto } from './image'
import Page from '../core/Page'
import { Breadcrumb } from '../types'
import { Tag } from '../core/Tag'

type Token = {
    token: string
    data: any
}

type PageDto = {
    title: string
    date?: string
    url: string
    data: string
    description: string
    cover?: ImageDto
    tokens: Token[]
    tags: Tag[]
    featured: boolean
    breadcrumb: Breadcrumb
}

export function encodePage(page: Page): PageDto {
    const cover = page.preview ? encodeImage(page.preview) : null
    const date = page.date ? page.date.toString() : null
    const breadcrumb = page.getBreadcrumb()

    return {
        title: page.title,
        url: page.url,
        data: page.data,
        description: page.description,
        tokens: page.tokens,
        tags: page.tags,
        featured: page.featured,
        cover,
        date,
        breadcrumb,
    }
}
