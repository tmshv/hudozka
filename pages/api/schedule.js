import { dbUri } from '../../src/config'
import { connect } from '../../src/core/db'
import { findSchedule } from '../../src/core/schedule'

export default async (req, res) => {
    await connect(dbUri)

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
}
