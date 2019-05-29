const {renderPage} = require('../render/page')
const {get} = require('koa-route')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash

module.exports = function (handleNotFound) {
	return get('*', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const body = await renderPage(path)
		if (body) {
			ctx.type = 'text/html'
			ctx.body = body
        } else {
            await handleNotFound(ctx)
        }
	})
}
