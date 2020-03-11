import Image from '../core/Image'
import { encodeImage } from '../factory/image'
import { Request, Response } from 'express'
import { oid } from '../db'

export async function getItem(req: Request, res: Response) {
    const slug = req.params.slug
    const id = oid(slug)
    if (!id) {
        res.status(400)
        return res.json({
            error: `Failed to parse ${slug} as ObjectId`
        })
    }

    const image = await Image.findById(id)
    if (image) {
        res.json(encodeImage(image))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${slug} not found`
        })
    }
}

export async function getItemByFile(req: Request, res: Response) {
    const file = req.query.file
    const image = await Image.findByFile(file)

    if (image) {
        res.json(encodeImage(image))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${file} not found`
        })
    }
}
