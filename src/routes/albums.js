const React = require('react')
const Article = require('../components/Article')
const {render} = require('../lib/render')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {get} = require('koa-route')
const {c} = require('../core/db')

async function findAlbum(id) {
	return c('albums').findOne({id})
}

async function processAlbum(album) {
	const url = `/album/${album.id}`

	const previewFromImage = imgs => imgs.length ? imgs[0] : null
	const previewImageId = album.preview ? album.preview : previewFromImage(album.images)
	if (previewImageId) {
		const image = await c('images').findOne({_id: previewImageId})
		album.preview = image.data.medium
	}

	return {
		...album,
		url,
	}
}

function getMeta(album) {
	return {
		title: album.title,
		description: album.title,
	}
}

function getAlbum() {
	return get('/album/:id', async (ctx, id) => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const record = await findAlbum(id)

		if (record) {
			const album = await processAlbum(record)

			const Component = (
				<div className="content content_thin">
					<Article
						title={album.title}
						date={album.date}
						data={album.post}
						shareable={true}
					/>
				</div>
			)

			ctx.type = 'text/html'
			ctx.body = await render(path, Component, getMeta(album), {commentsEnabled: true})
		} else {
			ctx.status = 404
		}
	})
}

exports.getAlbum = getAlbum
