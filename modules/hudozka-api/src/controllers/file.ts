import { Request, Response } from 'express'
import Document from '../core/Document'
import { encodeFile } from '../api/files'

export async function getItem(req: Request, res: Response) {
    const id = req.params.slug
    const document = await Document.findById(id)

    if (document) {
        res.json(encodeFile(document))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${id} not found`
        })
    }
}

export async function getAll(req: Request, res: Response) {
    const documents = await Document.find({ hidden: false })
    if (documents) {
        const items = documents
            .map(encodeFile)
            .filter(x => x.imageUrl) // skip documents without preview image; needs to be refactored

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
    const data = await Document.find({})

    if (data) {
        const items = data.map(x => `/document/${x.id}`)
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
