import { connect } from '../../../src/core/db'
import Article from '../../../src/core/Article'

export default async (req, res) => {
    await connect()

    const data = await Article.find({})

    if (data) {
        const items = data.map(x => `/article/${x.id}`)
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
