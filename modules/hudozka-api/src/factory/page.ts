import { encodeImage } from './image'
import Page from '../core/Page'
import { Breadcrumb } from '../types'

export function encodePage(page: Page, breadcrumb: Breadcrumb) {
    return {
        id: page.id,
        title: page.title,
        url: page.url,
        data: page.data,
        preview: encodeImage(page.preview),
        tokens: page.tokens,
        breadcrumb,
    }
}
