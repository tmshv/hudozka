import { connect } from '../../../src/core/db'
import Document from '../../../src/core/Document'
import { encodeFile } from '../../../src/api/files'

export default async (req, res) => {
    await connect()

    const id = req.query.document
    const document = await Document.findById(id)

    if (document) {
        res.json(encodeFile(document))
    } else {
        res.status(404)
        res.json({
            error: `Document ${id} not found`
        })
    }
}
