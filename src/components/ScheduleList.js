const React = require('react')
const text = require('../server/schedule').text

const ScheduleList = ({schedules}) => (
	<div className="schedule-selector">
		<ul>
			{schedules.map((s, index) => (
				<Schedule key={index} {...s}/>
			))}
		</ul>
	</div>
)

const Schedule = ({url, semester, period}) => (
	<li>
		<a href={url}>{text({semester, period})}</a>
	</li>
)

module.exports = ScheduleList
