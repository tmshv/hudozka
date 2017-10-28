const React = require('react')
const Article = require('../components/Article')
const Album = require('../core/Album')
const {render} = require('../lib/render')
const getHtml = require('../lib/component').getHtml

function getMeta(album) {
	return {
		title: album.title,
		description: album.title,
	}
}

async function renderAlbum(id) {
	const album = await Album.findById(id)

	if (!album) return null

	const Component = (
		<div className="content content_thin">
			<Article
				title={album.title}
				date={album.date}
				shareable={true}
			>
				{getHtml(album.post)}
			</Article>
		</div>
	)

	return render(album.url, Component, getMeta(album), {commentsEnabled: true, menuPadding: true})
}

exports.renderAlbum = renderAlbum
