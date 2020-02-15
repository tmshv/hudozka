import { encodeImage } from './image'

export function encodePage(page) {
    return {
        id: page.id,
        title: page.title,
        url: page.url,
        data: page.data,
        preview: encodeImage(page.preview),
        tokens: page.tokens,
    }
}
