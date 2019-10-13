import { connect } from '../../../src/core/db'
import Teacher from '../../../src/core/Teacher'
import { encodePerson } from '../../../src/api/persons'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const id = req.query.person
    const data = await Teacher.findById(id)

    if (data) {
        res.json(encodePerson(data))
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
})
