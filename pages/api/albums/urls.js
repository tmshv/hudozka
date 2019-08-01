import { connect } from '../../../src/core/db'
import Album from '../../../src/core/Album'

export default async (req, res) => {
    await connect()

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
