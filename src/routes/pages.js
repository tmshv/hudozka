const {readFile} = require('async-file')
const handlebars = require('handlebars')

const {get} = require('koa-route')
const {c} = require('../core/db')

const url = require('url')
const renderApp = require('../lib/component').renderApp
const isEqualPath = require('../lib/url').isEqualPath
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {compose, any} = require('../lib/common')

const menuModel = require('../models/menu').default
const config = require('../config')

async function getPage(path) {
	return await c('pages').findOne({url: path})
}

function isActive(path, menuItem) {
	return any(flatMenuItem(menuItem)
		.map(i => isEqualPath(path, i.url, true))
	)
}

function flatMenuItem(item) {
	const rootUrl = item.url
	const flatUrls = items => {
		return items.map(item => ({
			...item,
			url: url.resolve(rootUrl, item.url)
		}))
	}

	return !item.items
		? [item]
		: item.items.reduce((acc, i) => [...acc, ...compose(flatUrls, flatMenuItem)(i)], [item])
}

/**
 * Takes plain menu model and sample path and defines is an item of menu should be active
 *
 * @param path
 * @param menu
 * @return {{items}}
 */
function buildMenu(path, menu) {
	const items = menu.map(item => ({
		...item,
		active: isActive(path, item)
	}))
	return {items}
}

module.exports = function () {
	return get('*', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const page = await getPage(path)
		if (page) {
			const menu = buildMenu(path, menuModel)
			const content = renderApp({menu, page})

			const source = await readFile(config.viewMain, 'utf-8')
			const template = handlebars.compile(source)

			const title = page.title
			const meta = {
				title,
				description: title,
				image: 'https://art.shlisselburg.org/entrance.jpg',
				url: `https://art.shlisselburg.org${path}`,
			}

			ctx.type = 'text/html'
			ctx.body = template({content, title, meta})
		} else {
			ctx.status = 404
		}
	})
}
