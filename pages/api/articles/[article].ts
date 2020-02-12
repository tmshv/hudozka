import { NextApiRequest, NextApiResponse } from 'next'
import Article from '../../../src/core/Article'
import { encodeArticle } from '../../../src/server/articles'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
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
})
