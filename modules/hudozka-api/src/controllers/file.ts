import { Request, Response } from 'express'
import Document from '../core/Document'
import { encodeFile, encodeFileUrl } from '../factory/file'

export async function getItem(req: Request, res: Response) {
    const slug = req.params.slug
    const item = await Document.findBySlug(slug)
    if (item) {
        res.json(encodeFile(item))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${slug} not found`
        })
    }
}

export async function getUrls(req: Request, res: Response) {
    const data = await Document.find({})

    if (data) {
        const items = data.map(encodeFileUrl)
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
