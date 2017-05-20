const {readFile} = require('async-file')
const handlebars = require('handlebars')

function notFound(templateFile) {
	return async (ctx, next) => {
		await next()

		if (ctx.status === 404) {
			const source = await readFile(templateFile, 'utf-8')
			const template = handlebars.compile(source)

			ctx.type = 'text/html'
			ctx.body = template()
		}
	}
}

exports.notFound = notFound
