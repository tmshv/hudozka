const React = require('react')
const Article = require('../components/Article')
const TeacherProfile = require('../components/TeacherProfile')
const Teacher = require('../core/Teacher')
const ImageArtifactType = require('../core/ImageArtifactType')
const {render} = require('../lib/render')
const {prioritySort} = require('../lib/sort')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash

const {get} = require('koa-route')

function getCollectiveMeta() {
	return {
		title: 'Преподаватели',
		description: 'Преподаватели Шлиссельбургской ДХШ',
	}
}

function getMeta(teacher) {
	return {
		title: teacher.name,
		description: 'Преподаватель Шлиссельбургской ДХШ',
	}
}

const pictureTypes = [
	ImageArtifactType.BIG,
	ImageArtifactType.MEDIUM,
	ImageArtifactType.ORIGIN,
]

const profilePicture = profile => profile.picture.findArtifact(pictureTypes)

function getCollective(order) {
	const teachersSorted = prioritySort.bind(null, order, t => t.id)

	return get('/collective', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		let teachers = await Teacher.find({})

		if (teachers) {
			teachers = teachersSorted(teachers)

			const Component = (
				<div className="page-collective content content_full">
					<img className="page-collective__collective-image"
						 width="100%"
						 src="https://static.shlisselburg.org/art/graphics/collective.jpg"
					/>

					<div className="content content_semi-wide">
						{teachers.map((teacher, index) => (
							<TeacherProfile key={index}
											profile={teacher}
											picture={profilePicture(teacher)}
											url={teacher.url}
											biography={teacher.biography}
											name={teacher.splitName()}
							/>
						))}
					</div>
				</div>
			)

			ctx.type = 'text/html'
			ctx.body = await render(path, Component, getCollectiveMeta(), {menuPadding: false})
		} else {
			ctx.status = 404
		}
	})
}

function getTeacher() {
	return get('/teacher/:id', async (ctx, id) => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const teacher = await Teacher.findById(id)

		if (teacher) {
			const Component = (
				<div className="content content_semi-wide">
					<TeacherProfile profile={teacher}
									picture={profilePicture(teacher)}
									biography={teacher.biography}
									name={teacher.splitName()}
									shareable={true}
					/>
				</div>
			)

			ctx.type = 'text/html'
			ctx.body = await render(path, Component, getMeta(teacher), {commentsEnabled: true})
		} else {
			ctx.status = 404
		}
	})

}

exports.getCollective = getCollective
exports.getTeacher = getTeacher
