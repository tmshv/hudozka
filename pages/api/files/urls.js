import { connect } from '../../../src/core/db'
import Document from '../../../src/core/Document'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const data = await Document.find({})

    if (data) {
        const items = data.map(x => `/document/${x.id}`)
        res.json({
            items
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
})
