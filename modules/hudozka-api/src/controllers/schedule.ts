import { findSchedule } from '../server/schedule'
import { Request, Response } from 'express'
import { collection } from '../db'

export async function getItem(req: Request, res: Response)  {
    const period = req.query.period
    const semester = req.query.semester
    const data = await findSchedule(collection, period, semester)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Schedule ${period}:${semester} not found`
        })
    }
}
