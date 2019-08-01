import { dbUri } from '../../../src/config'
import { connect } from '../../../src/core/db'
import Document from '../../../src/core/Document'
import { encodeFile } from '../../../src/api/files'

export default async (req, res) => {
    await connect(dbUri)

    const documents = await Document.find({hidden: false})
    if (documents) {
        const items = documents
            .map(encodeFile)
            .filter(x => x.imageUrl) // skip documents without preview image; needs to be refactored

        res.json({
            items,
        })
    } else {
        res.status(404)
        res.json({
            error: `Documents not found`
        })
    }
}
