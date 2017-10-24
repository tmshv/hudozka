const React = require('react')
const Picture = require('../components/Image')
const CollectiveImage = require('../components/CollectiveImage')
const Page = require('../components/Page')
const PersonCard = require('../components/PersonCard')
const {render} = require('../lib/render')
const timestamp = require('../lib/date').timestamp
const ImageArtifactType = require('../core/ImageArtifactType')
const Teacher = require('../core/Teacher')
const Image = require('../core/Image')
const Config = require('../core/Config')
const {sortBy} = require('../utils/sort')
const {prioritySort} = require('../lib/sort')

function getMeta(teacher) {
	return {
		title: teacher.name,
		description: teacher.name,
	}
}

function getCollectiveMeta() {
	return {
		title: 'Преподаватели',
		description: 'Преподаватели Шлиссельбургской ДХШ',
	}
}

// function getMeta(article) {
// 	const types = [
// 		ImageArtifactType.FACEBOOK,
// 		ImageArtifactType.MEDIUM,
// 		ImageArtifactType.BIG,
// 		ImageArtifactType.ORIGIN,
// 	]
// 	const meta = {
// 		title: article.title,
// 	}
//
// 	if (article.preview) {
// 		try {
// 			const artifact = article.preview.findArtifact(types)
// 			meta.image = artifact.url
// 			meta.imageWidth = artifact.width
// 			meta.imageHeight = artifact.height
// 		} catch (error) {
// 			meta.image = 'https://art.shlisselburg.org/entrance.jpg'
// 			meta.imageWidth = 1200
// 			meta.imageHeight = 630
// 		}
// 	}
// 	return meta
// }

async function renderPerson(id) {
	const teacher = await Teacher.findById(id)
	if (!teacher) return null

	const Component = (
		<div className="content content_thin">
			<Page shareable={true}>{teacher.post}</Page>
		</div>
	)

	return render(teacher.url, Component, getMeta(teacher), {commentsEnabled: true, menuPadding: true})
}

const profilePicture = profile => profile.picture.getPicture(ImageArtifactType.BIG)

async function renderCollective(path, order) {
	const config = await Config.findConfig()
	if (!config) return null

	const collectiveImage = await Image.findByFile(config.collectiveImage)
	if (!collectiveImage) return null

	let teachers = await Teacher.find({hidden: false})
	if (!teachers) return null

	const teachersSorted = prioritySort.bind(null, [...order], t => t.id)
	teachers = teachersSorted(teachers)

	const image = collectiveImage.getPicture(ImageArtifactType.LARGE)

	const PersonCardList = ({children}) => (
		<div className="PersonCardList">
			{children}
		</div>
	)

	const Component = (
		<div className="content content_semi-wide">
			<CollectiveImage data={image}/>

			<PersonCardList>
				{teachers.map((teacher, index) => (
					<PersonCard
						key={index}
						profile={teacher}
						picture={profilePicture(teacher)}
						url={teacher.url}
						name={teacher.splitName()}
					/>
				))}
			</PersonCardList>
		</div>
	)

	return render(path, Component, getCollectiveMeta(), {menuPadding: true})
}

exports.renderPerson = renderPerson
exports.renderCollective = renderCollective
