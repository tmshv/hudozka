import { connect } from '../../../src/core/db'
import Teacher from '../../../src/core/Teacher'
import { prioritySort } from '../../../src/lib/sort'
import { encodePerson } from '../../../src/api/persons'
import { withMiddleware } from '../../../src/middlewares/withMiddleware'

export default withMiddleware(async (req, res) => {
    await connect()

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
            error: `Article ${id} not found`
        })
    }
})
