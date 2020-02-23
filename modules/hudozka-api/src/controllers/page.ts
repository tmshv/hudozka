import { Request, Response } from 'express'
import Page from '../core/Page'
import { dropTrailingSlash, getPathWaterfall } from '../lib/url'
import { encodePage } from '../factory/page'
import { Breadcrumb } from '../types'

async function getBreadcrumbs(path: string): Promise<Breadcrumb> {
    const bc = getPathWaterfall(path)
    const parts = await Promise.all(bc.map(async href => {
        const resource = await Page.findByUrl(href)

        if (!resource) {
            return null
        }

        const name = resource.title

        return {
            name,
            href,
        }
    }))

    return parts.filter(Boolean)
}

export async function getItem(req: Request, res: Response) {
    const page = dropTrailingSlash(req.query.page)
    const breadcrumbs = await getBreadcrumbs(page)
    const resource = await Page.findByUrl(page)

    if (resource) {
        res.json(encodePage(resource, breadcrumbs))
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
