import { dbUri } from '../../../src/config'
import { connect } from '../../../src/core/db'
import { findArticles } from '../../../src/api/articles'

export default async (req, res) => {
    await connect(dbUri)

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
}
