import { connect } from '../../../src/core/db'
import Article from '../../../src/core/Article'
import { encodeArticle } from '../../../src/api/articles'

export default async (req, res) => {
    await connect()

    const {
        query: { article: id }
    } = req;

    const article = await Article.findById(id)

    if (article) {
        res.json(encodeArticle(article))
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
}
