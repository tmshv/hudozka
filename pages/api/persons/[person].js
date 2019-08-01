import { dbUri } from '../../../src/config'
import { connect } from '../../../src/core/db'
import Teacher from '../../../src/core/Teacher'
import { encodePerson } from '../../../src/api/persons'

export default async (req, res) => {
    await connect(dbUri)

    const id = req.query.person
    const person = await Teacher.findById(id)
    const data = encodePerson(person)

    if (data) {
        res.json(data)
    } else {
        res.status(404)
        res.json({
            error: `Article ${id} not found`
        })
    }
}
