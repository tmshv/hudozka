import { connect } from '../../../src/core/db'
import { findArticles } from '../../../src/api/articles'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const { query } = req
    const page = parseInt(query.page)
    const pageSize = parseInt(query.pageSize)

    const data = await findArticles(page, pageSize)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
})
