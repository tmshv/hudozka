import { Response, Request } from 'express'
import Album from '../core/Album'

export async function getItem(req: Request, res: Response) {
    const id = req.params.slug
    const album = await Album.findById(id)

    if (album) {
        res.json(album)
    } else {
        res.status(404)
        res.json({
            error: `Resource ${id} not found`
        })
    }
}

export async function getAll(req: Request, res: Response) {
    const data = await Album.find({}, { sort: { date: -1 } })

    if (data) {
        res.json({
            items: data,
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
}

export async function getUrls (req: Request, res: Response) {
    const data = await Album.find({})

    if (data) {
        const items = data.map(x => `/album/${x.id}`)
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
