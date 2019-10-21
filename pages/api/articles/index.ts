import { findArticles } from '../../../src/server/articles'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

const int = (value: string | string[]) => parseInt(Array.isArray(value)
    ? value[0]
    : value
)

export default withMiddleware(async (req, res) => {
    const { query } = req
    const page = int(query.page)
    const pageSize = int(query.pageSize)

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
