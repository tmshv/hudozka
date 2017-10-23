const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {renderPerson, renderCollective} = require('../render/persons')
const {get} = require('koa-route')

function getCollective(order) {
	return get('/collective', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const body = await renderCollective(path, order)

		if (body) {
			ctx.type = 'text/html'
			ctx.body = body
		} else {
			ctx.status = 404
		}
	})
}

function getTeacher() {
	return get('/teacher/:id', async (ctx, id) => {
		const body = await renderPerson(id)

		if (body) {
			ctx.type = 'text/html'
			ctx.body = body
		} else {
			ctx.status = 404
		}
	})

}

exports.getCollective = getCollective
exports.getTeacher = getTeacher
