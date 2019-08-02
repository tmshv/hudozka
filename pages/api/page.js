import { connect } from '../../src/core/db'
import Page from '../../src/core/Page'
import { getPathWithNoTrailingSlash } from '../../src/lib/url'
import { encodePage } from '../../src/api/page'

export default async (req, res) => {
    await connect()

    const page = getPathWithNoTrailingSlash(req.query.page)
    const resource = await Page.findByUrl(page)
    
    if (resource) {
        res.json(encodePage(resource))
    } else {
        res.status(404)
        res.json({
            error: `Image ${page} not found`
        })
    }
}
