const React = require('react')
const Page = require('../core/Page')
const ImageArtifactType = require('../core/ImageArtifactType')

const {render} = require('../lib/render')

const metaImageTypesPriority = [
	ImageArtifactType.FACEBOOK,
	ImageArtifactType.MEDIUM,
	ImageArtifactType.BIG,
	ImageArtifactType.ORIGIN,
]

function getMeta(page) {
	const meta = {
		title: page.title,
		description: page.title,
	}

	if (page.preview) {
		try {
			const artifact = page.preview.findArtifact(metaImageTypesPriority)
			meta.image = artifact.url
			meta.imageWidth = artifact.width
			meta.imageHeight = artifact.height
		} catch (error) {
		}
	}
	return meta
}

function getComponent(page) {
	const Page = require('../components/Page')

	return (
		<div className="content content_thin">
			<Page shareable={true}>{page.data}</Page>
		</div>
	)
}

async function renderPage(path) {
	const page = await Page.findByUrl(path)
	if (!page) return null

	return render(
		path,
		getComponent(page),
		getMeta(page),
		{menuPadding: true},
	)
}

exports.renderPage = renderPage
