import Image from '../core/Image'
import { encodeImage } from '../factory/image'
import { Request, Response } from 'express'

export async function getItem(req: Request, res: Response) {
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
