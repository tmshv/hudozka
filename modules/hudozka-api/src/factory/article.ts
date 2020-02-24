import Article from '../core/Article'
import { encodeImage } from './image'

export function encodeArticle(article: Article) {
    return {
        ...article,
        preview: encodeImage(article.preview),
    }
}