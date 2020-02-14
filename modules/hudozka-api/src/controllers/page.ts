import { Request, Response } from 'express'
import Page from '../core/Page'
import { getPathWithNoTrailingSlash } from '../lib/url'
import { encodePage } from '../api/page'

export async function getItem(req: Request, res: Response) {
    const id = req.params.slug
    const page = getPathWithNoTrailingSlash(id)
    const resource = await Page.findByUrl(page)
    
    if (resource) {
        res.json(encodePage(resource))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${page} not found`
        })
    }
}

export async function getAll(req: Request, res: Response) {
    const items = await Page.find({})

    if (items) {
        res.json({
            items,
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
}

export async function getUrls(req: Request, res: Response) {
    const data = await Page.find({})

    if (data) {
        const items = data.map(x => x.url)

        res.json({
            items,
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
}
