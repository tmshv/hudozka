import { connect } from '../../src/core/db'
import Image from '../../src/core/Image'
import { encodeImage } from '../../src/api/image'
import { withMiddleware } from '../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const file = req.query.file
    const image = await Image.findByFile(file)
    
    if (image) {
        res.json(encodeImage(image))
    } else {
        res.status(404)
        res.json({
            error: `Image ${file} not found`
        })
    }
})
