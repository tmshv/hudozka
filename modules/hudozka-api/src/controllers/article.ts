import Article from '../core/Article'
import { findArticles } from '../server/articles'
import { Request, Response } from 'express'
import { encodeArticle } from '../factory/article'
import { readQueryInt } from '../lib/url'

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
    const page = readQueryInt(req, 'page')
    const pageSize = readQueryInt(req, 'pageSize')

    const data = await findArticles(page, pageSize)

    if (data) {
        res.json({
            ...data,
            items: data.items.map(encodeArticle)
        })
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
