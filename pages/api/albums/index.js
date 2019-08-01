import { connect } from '../../../src/core/db'
import Album from '../../../src/core/Album'

export default async (req, res) => {
    await connect()

    const data = await Album.find({}, { sort: { date: -1 } })
    if (data) {
        res.json({
            items: data,
        })
    } else {
        res.status(404)
        res.json({
            error: `Article not found`
        })
    }
}
