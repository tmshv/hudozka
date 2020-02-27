import Article from '../core/Article'
import { encodeImage } from './image'

export function encodeArticle(article: Article) {
    const preview = article.preview ? encodeImage(article.preview) : null

    return {
        ...article,
        preview,
    }
}