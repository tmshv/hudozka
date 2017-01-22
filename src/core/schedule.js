import {c} from '../core/db'
import {select} from '../utils/fn'
import {createMap} from '../utils/common'
import {getCollective} from './collective'

import {scheduleDate, getPeriod as schedulePeriod} from '../models/schedule'
import {getCourse} from '../models/course'

const SCHEDULES = 'schedules'

export async function getSchedule(period, semester) {
	const schedule = await c(SCHEDULES).findOne({
		$or: [
            {period: period},
            {period: schedulePeriod(period)}
		],
		semester: semester
	})

	return schedule ? migrate(schedule) : null
}

export async function getSchedules(fields = ['_id', 'id', 'period', 'semester']) {
	const list = await c(SCHEDULES)
        .find({})
        .toArray()

	const schedules = await Promise.all(list.map(migrate))
	return schedules
        .sort((a, b) => {
	const ad = scheduleDate(a).getTime()
	const bd = scheduleDate(b).getTime()
	return ad - bd
})
        .map(select(fields))
}

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
	const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

	const persons = await getCollective()
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
