import { dbUri } from '../../src/config'
import { connect } from '../../src/core/db'
import Image from '../../src/core/Image'
import ImageArtifactType from '../../src/core/ImageArtifactType'

export default async (req, res) => {
    await connect(dbUri)

    const file = req.query.file
    const image = await Image.findByFile(file)
    
    if (image) {
        const data = image.getPicture(ImageArtifactType.LARGE)
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Image ${file} not found`
        })
    }
}
