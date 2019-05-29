const {get} = require('koa-route')
const {renderEdit} = require('../lib/render')

function getEdit() {
	return get('/edit', async ctx => {
		ctx.body = await renderEdit()
	})
}

exports.getEdit = getEdit
