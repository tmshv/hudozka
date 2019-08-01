import { dbUri } from '../../../src/config'
import { connect } from '../../../src/core/db'
import Album from '../../../src/core/Album'

export default async (req, res) => {
    await connect(dbUri)

    const id = req.query.album
    const album = await Album.findById(id)

    if (album) {
        res.json(album)
    } else {
        res.status(404)
        res.json({
            error: `Album ${id} not found`
        })
    }
}
