import { connect } from '../../../src/core/db'
import Teacher from '../../../src/core/Teacher'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const data = await Teacher.find({})

    if (data) {
        const items = data.map(x => `/teacher/${x.id}`)
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
