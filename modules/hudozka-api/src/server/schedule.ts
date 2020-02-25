import { createMap } from '../utils/common'
import {
    scheduleDate,
    getPeriod as schedulePeriod,
    getPeriodString
} from '../models/schedule'
import { getCourse } from '../models/course'

// import { last } from 'lodash'
// const sortBy = require('../lib/sort').sortBy

const SCHEDULES = 'schedules'

export async function findSchedule(collection, period, semester) {
    const schedule = await collection(SCHEDULES).findOne({
        $or: [
            { period: period },
            { period: schedulePeriod(period) }
        ],
        semester: semester
    })

    return schedule ? migrate(schedule) : null
}

// async function findAllScheduleParams() {
//     const schedules = await collection(SCHEDULES)
//         .find({}, {
//             period: 1,
//             semester: 1,
//             _id: 0,
//         })
//         .toArray()

//     return schedules
//         .map(i => ({
//             ...i,
//             period: schedulePeriod(i.period),
//         }))
//         .sort(sortBy(
//             i => scheduleDate(i).getTime(),
//             true,
//         ))
// }

// function text({ semester, period }) {
//     const word = semester => [['spring', 'Весна'], ['autumn', 'Осень']]
//         .find(i => i[0] === semester)
//     [1]
//     const periodIndex = semester === 'spring' ? 1 : 0
//     const year = period[periodIndex]

//     return `${word(semester)} ${year} года`
// }

async function migrate(schedule) {
    const versions = {
        '1.0': migrate10to20,
        '2.0': migrate20to30,
    }

    const version = schedule.version
    const update = versions[version]
    return version in versions ? migrate(update(schedule)) : schedule
}

function migrate10to20(schedule) {
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    const time = time => time
        .map(i => i.split(' '))

    const week = days => days.reduce((week, lesson, index) => {
        if (lesson) {
            const day = dayNames[index]
            week[day] = [Object.assign(lesson, {
                time: time(lesson.time)
            })]
        }

        return week
    }, {})

    return Object.assign(schedule, {
        version: '2.0',
        period: schedulePeriod(schedule.period),
        groups: schedule.schedule
            .map(group => ({
                name: group.group,
                time: group.time,
                week: week(group.week)
            }))
    })
}

async function migrate20to30(schedule) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']//, 'sun']

    const persons = []
    const person = createMap(i => i.id, persons)

    const week = week => days
        .map(day => week[day] || [])
        .map(lessons => lessons.map(lesson))

    const lesson = i => ({
        time: i.time,
        course: getCourse(i.lesson),
        teacher: person.has(i.teacher) ? teacher(i.teacher) : teacherDummy(i.teacher)
    })

    const teacher = id => ({
        id: id,
        url: `/teacher/${id}`,
        name: personName(id)
    })

    const teacherDummy = name => ({
        id: name,
        url: null,
        name: name
    })

    const personName = id => person.has(id) ? person.get(id).name : null

    return Object.assign(schedule, {
        version: '3.0',
        groups: schedule.groups
            .map(group => ({
                name: group.name,
                time: group.time,
                week: week(group.week)
            }))
    })
}
