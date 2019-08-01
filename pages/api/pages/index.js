import { connect } from '../../../src/core/db'
import Page from '../../../src/core/Page'

export default async (req, res) => {
    await connect()

    const items = await Page.find({})

    if (items) {
        res.json({
            items,
        })
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
}
