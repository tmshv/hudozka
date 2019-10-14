import { findArticles } from '../../../src/server/articles'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    const { query } = req
    const page = parseInt(query.page)
    const pageSize = parseInt(query.pageSize)

    const data = await findArticles(page, pageSize)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Articles not found`
        })
    }
})
