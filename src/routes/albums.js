const React = require('react')
const Article = require('../components/Article')
const Album = require('../core/Album')
const {render} = require('../lib/render')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {get} = require('koa-route')

function getMeta(album) {
	return {
		title: album.title,
		description: album.title,
	}
}

function getAlbum() {
	return get('/album/:id', async (ctx, id) => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const album = await Album.findById(id)

		if (album) {
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
			ctx.body = await render(path, Component, getMeta(album), {commentsEnabled: true, menuPadding: true})
		} else {
			ctx.status = 404
		}
	})
}

exports.getAlbum = getAlbum
