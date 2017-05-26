const React = require('react')
const Page = require('../components/Page')

const {get} = require('koa-route')
const {c} = require('../core/db')

const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {render} = require('../lib/render')


async function getPage(path) {
	return await c('pages').findOne({url: path})
}

function getPageMeta(page) {
	return {
		title: page.title,
	}
}

function getComponent(page) {
	return (
		<div className="content content_thin">
			<Page shareable={true}>{page.data}</Page>
		</div>
	)
}

module.exports = function () {
	return get('*', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const page = await getPage(path)
		if (page) {
			ctx.type = 'text/html'
			ctx.body = await render(
				path,
				getComponent(page),
				getPageMeta(page),
			)
		} else {
			ctx.status = 404
		}
	})
}
