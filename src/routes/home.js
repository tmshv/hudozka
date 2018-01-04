const {get} = require('koa-route')
const {renderHome} = require('../render/home')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash

function getHome(pageSize) {
	return get('/', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		ctx.body = await renderHome(path, pageSize)
	})
}

exports.getHome = getHome
