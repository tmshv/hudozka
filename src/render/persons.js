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

const metaImageTypesPriority = [
	ImageArtifactType.FACEBOOK,
	ImageArtifactType.MEDIUM,
	ImageArtifactType.BIG,
	ImageArtifactType.ORIGIN,
]

function getMeta(teacher) {
	const meta = {
		title: teacher.name,
	}

	if (teacher.preview) {
		try {
			const artifact = teacher.preview.findArtifact(metaImageTypesPriority)
			meta.image = artifact.url
			meta.imageWidth = artifact.width
			meta.imageHeight = artifact.height
		} catch (error) {
		}
	}
	return meta
}

function getCollectiveMeta(picture) {
	const meta = {
		title: 'Преподаватели Шлиссельбургской ДХШ',
		description: 'Преподаватели Шлиссельбургской ДХШ',
	}

	if (picture) {
		const artifact = picture.findArtifact(metaImageTypesPriority)
		meta.image = artifact.url
		meta.imageWidth = artifact.width
		meta.imageHeight = artifact.height
	}

	return meta
}

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

	let teachers = await Teacher.find({hidden: false})
	if (!teachers) return null

	const teachersSorted = prioritySort.bind(null, [...order], t => t.id)
	teachers = teachersSorted(teachers)

	const image = collectiveImage
		? collectiveImage.getPicture(ImageArtifactType.LARGE)
		: null

	const PersonCardList = ({children}) => (
		<div className="PersonCardList">
			{children}
		</div>
	)

	const Component = (
		<div className="content content_semi-wide">
			{!image ? null : (
				<CollectiveImage data={image}/>
			)}

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

	return render(path, Component, getCollectiveMeta(collectiveImage), {menuPadding: true})
}

exports.renderPerson = renderPerson
exports.renderCollective = renderCollective
