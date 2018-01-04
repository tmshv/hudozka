const {get} = require('koa-route')
const Article = require('../components/Article')
const {renderArticles, renderArticle} = require('../render/articles')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const accepts = require('./index').accepts

function getArticles(pageSize) {
	return get('/articles/:page?', async (ctx, page) => {
		page = parseInt(page) || 1

		if (page === 1) {
			ctx.redirect('/')
		} else {
			const path = getPathWithNoTrailingSlash(ctx.path)

			ctx.body = await renderArticles(path, page, pageSize)
		}
	})
}

function getArticle() {
	return get('/article/:id', accepts({
		'text/html': async (ctx, id) => {
			const body = await renderArticle(id)

			if (body) {
				ctx.type = 'text/html'
				ctx.body = body
			} else {
				ctx.status = 404
			}
		},
		'application/json': async (ctx, id) => {
			const article = await Article.findById(id)

			if (article) {
				ctx.body = article
			} else {
				ctx.status = 404
			}
		}
	}))
}

exports.getArticles = getArticles
exports.getArticle = getArticle
