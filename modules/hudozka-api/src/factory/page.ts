import { encodeImage } from './image'
import Page from '../core/Page'
import { Breadcrumb } from '../types'

export function encodePage(page: Page, breadcrumb: Breadcrumb) {
    const preview = page.preview ? encodeImage(page.preview) : null

    return {
        id: page.id,
        title: page.title,
        url: page.url,
        data: page.data,
        description: page.description,
        preview,
        tokens: page.tokens,
        breadcrumb,
    }
}
