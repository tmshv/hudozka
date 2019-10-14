import { connect } from '../../src/core/db'
import { findSchedule } from '../../src/server/schedule'
import { withMiddleware } from '../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

    const period = req.query.period
    const semester = req.query.semester
    const data = await findSchedule(period, semester)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Schedule ${period}:${semester} not found`
        })
    }
})
