import Article from '../core/Article'
import { encodeArticle, findArticles } from '../server/articles'
import { Request, Response } from 'express'

const int = (value: string | string[]) => parseInt(Array.isArray(value)
    ? value[0]
    : value
)

export async function getItem(req: Request, res: Response) {
    const id = req.params.slug
    const article = await Article.findById(id)

    if (article) {
        res.json(encodeArticle(article))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${id} not found`
        })
    }
}

export async function getAll(req: Request, res: Response) {
    const { query } = req
    const page = int(query.page)
    const pageSize = int(query.pageSize)

    const data = await findArticles(page, pageSize)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Articles not found`
        })
    }
}

export async function getUrls(req: Request, res: Response) {
    const data = await Article.find({})

    if (data) {
        const items = data.map(x => `/article/${x.id}`)
        res.json({
            items
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
}
