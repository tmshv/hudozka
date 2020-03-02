import Page from '../core/Page'
import { Request, Response } from 'express'
import { unique } from '../lib/array'

export async function getAll(req: Request, res: Response) {
    const data = await Page.find({})
    const tags = data
        .flatMap(x => x.tags)
        .filter(x => x.isValid())
    const items = unique(tags, t => t.slug)

    if (data) {
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

export async function findItems(req: Request, res: Response) {
    const slug = req.params.slug

    const data = await Page.find({
        tags: {
            
        }
       
    })
    const tags = data
        .flatMap(x => x.tags)
        .filter(x => x.isValid())
    const items = unique(tags, t => t.slug)

    if (data) {
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
