import Article from '../core/Article'
import ImageArtifactType from '../core/ImageArtifactType'
import { sortBy } from '../utils/sort'
import { timestamp } from '../lib/date'
import { encodeImage } from '../api/image'

export const sortArticleByDate = sortBy(
    x => timestamp(new Date(x.date))
)

export async function findArticlesNin(nin, skip, limit, sort) {
    const query = {
        _id: { $nin: nin }
    }

    return Article.find(query, {
        sort,
        skip,
        limit,
    })
}

export async function findArticles(page, pageSize) {
    const limit = pageSize
    const skip = (page - 1) * pageSize

    const pinnedArticles = page === 1
        ? await Article.findPinned()
        : []

    const total = await Article.total()
    const totalPages = Math.ceil(total / pageSize)

    const id = i => i._id
    const pinnedIds = pinnedArticles.map(id)
    const articles = await findArticlesNin(pinnedIds, skip, limit, { date: -1 })

    const prevPage = page > 1
        ? page - 1
        : null

    const nextPage = page < totalPages
        ? page + 1
        : null

    const items = [
        ...pinnedArticles.sort(sortArticleByDate),
        ...articles
    ]
        .map(x => x.plain())
        .map(x => ({
            ...x,
            preview: !x.preview ? null : (
                x.preview.getPicture(ImageArtifactType.MEDIUM)
            )
        }))

    return {
        items,
        prevPage,
        nextPage,
        totalPages,
    }
}

export function encodeArticle(article) {
    return {
        ...article,
        preview: encodeImage(article.preview),
    }
}