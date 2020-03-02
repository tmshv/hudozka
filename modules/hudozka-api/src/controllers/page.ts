import { Request, Response } from 'express'
import Page from '../core/Page'
import { dropTrailingSlash, getPathWaterfall, readQueryArray, readQueryInt, readQueryString } from '../lib/url'
import { encodePage } from '../factory/page'
import * as breadcrumb from './breadcrumb'

function getSort(sortBy: string) {
    if (!sortBy) {
        return null
    }

    if (sortBy.charAt(0) === '-') {
        return {
            [sortBy.substr(1, sortBy.length)]: -1,
        }
    }

    return {
        [sortBy]: 1,
    }
}

async function resolveItem(page: Page) {
    const breadcrumbs = await breadcrumb.getItems(page.getUrl())
    page.setBreadcrumb(breadcrumbs)

    return page
}

export async function getItem(req: Request, res: Response) {
    const pageUrl = dropTrailingSlash(req.query.page)
    const resource = await Page.findByUrl(pageUrl)

    if (resource) {
        const page = await resolveItem(resource)
        res.json(encodePage(page))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${pageUrl} not found`
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

export async function getByTags(req: Request, res: Response) {
    const skip = readQueryInt(req, 'skip')
    const limit = readQueryInt(req, 'limit')
    const sortBy = readQueryString(req, 'sortBy')
    const sort = getSort(sortBy)

    const tags = readQueryArray(req, 'tag')
    if (tags.length === 0) {
        res.status(400)
        return res.json({
            error: `No tags in request`
        })
    }

    const options = { skip, limit, sort }
    const models = await Page.find({
        tags: { $in: ['event', 'album'] },
    }, options)

    if (models) {
        const pages = await Promise.all(models.map(resolveItem))
        const items = pages.map(encodePage)

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
