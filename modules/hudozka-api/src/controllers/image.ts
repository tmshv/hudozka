import Image from '../core/Image'
import { encodeImage } from '../api/image'
import { Request, Response } from 'express'

export async function getItem(req: Request, res: Response) {
    const file = req.params.slug
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
