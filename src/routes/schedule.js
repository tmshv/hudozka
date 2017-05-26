const React = require('react')
const Share = require('../components/Share')
const Schedule = require('../components/Schedule')
const ScheduleList = require('../components/ScheduleList')
const {render} = require('../lib/render')
const getPeriodString = require('../models/schedule').getPeriodString
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {get} = require('koa-route')

const {findSchedule, findDefaultScheduleParams, findAllScheduleParams} = require('../core/schedule')
const text = require('../core/schedule').text

function getMeta(schedule) {
	const t = text(schedule)
	return {
		title: t,
		description: t,
	}
}

function getSchedule() {
	return get('/schedule/:period?/:semester?', async (ctx, period, semester) => {
		const useRoute = Boolean(period) && Boolean(semester)
		if (useRoute) {
			const path = getPathWithNoTrailingSlash(ctx.path)

			const data = await findSchedule(period, semester)
			if (data) {

				//let schedules = await findAllScheduleParams()
				//schedules = schedules.map(({semester, period}) => ({
				//	period,
				//	semester,
				//	url: `/schedule/${getPeriodString(period)}/${semester}`,
				//}))

				const Component = (
					<div className="content content_wide">
						{/*<ScheduleList schedules={schedules}/>*/}

						<Schedule {...data}/>

						<Share/>
					</div>
				)

				ctx.type = 'text/html'
				ctx.body = await render(path, Component, getMeta(data))
			} else {
				ctx.status = 404
			}
		} else {
			const route = await findDefaultScheduleParams()

			if (route) {
				const {period, semester} = route
				ctx.redirect(`/schedule/${period}/${semester}`)
			} else {
				ctx.status = 404
			}
		}
	})
}

exports.getSchedule = getSchedule
