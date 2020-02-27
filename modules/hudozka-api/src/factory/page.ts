import { encodeImage } from './image'
import Page from '../core/Page'
import { Breadcrumb } from '../types'

export function encodePage(page: Page, breadcrumb: Breadcrumb) {
    const preview = encodeImage(page.preview)

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
