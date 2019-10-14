// import { findArticles } from '../../../src/api/articles'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'
import Article from '../../../src/core/Article'

export default withMiddleware(async (req, res) => {
    // const { query } = req
    // const page = parseInt(query.page)
    // const pageSize = parseInt(query.pageSize)

    // const data = await findArticles(page, pageSize)
    const data = await Article.find({})

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
})
