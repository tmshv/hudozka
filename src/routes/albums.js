const {renderAlbum} = require('../render/albums')
const {get} = require('koa-route')

function getAlbum() {
	return get('/album/:id', async (ctx, id) => {
		const body = await renderAlbum(id)

		if (body) {
			ctx.type = 'text/html'
			ctx.body = body
		} else {
			ctx.status = 404
		}
	})
}

exports.getAlbum = getAlbum
