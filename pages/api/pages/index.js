import { connect } from '../../../src/core/db'
import Page from '../../../src/core/Page'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
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
})
