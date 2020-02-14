import Teacher from '../core/Teacher'
import { encodePerson } from '../api/persons'
import { Request, Response } from 'express'
import { prioritySort } from '../lib/sort'

export async function getItem(req: Request, res: Response) {
    const id = req.params.slug
    const data = await Teacher.findById(id)

    if (data) {
        res.json(encodePerson(data))
    } else {
        res.status(404)
        res.json({
            error: `Resource ${id} not found`
        })
    }
}

export async function getAll(req: Request, res: Response) {
    const order = [
        'mg-timasheva',
        'va-sarzhin',
        'od-gogoleva',
        'my-valkova',
        'nv-andreeva',
        'vv-voronova',
    ]
    const teachersSorted = prioritySort.bind(null, [...order], t => t.id)

    const teachers = await Teacher.find({ hidden: false })
    const data = teachersSorted(teachers).map(encodePerson)

    if (data) {
        res.json({
            items: data,
        })
    } else {
        res.status(404)
        res.json({
            error: `Not found`
        })
    }
}

export async function getUrls(req: Request, res: Response) {
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
}
