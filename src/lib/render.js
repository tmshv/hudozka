const {readFile} = require('async-file')
const handlebars = require('handlebars')

const url = require('url')
const renderApp = require('../lib/component').renderApp
const getHtml = require('../lib/component').getHtml
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const urlToPattern = require('../lib/url').urlToPattern
const isMatchPathPattern = require('../lib/url').isMatchPathPattern
const isEqualPate = require('../lib/url').isEqualPath
const {compose, any} = require('../lib/common')

const menuModel = require('../models/menu').default
const config = require('../config')

const defaultOptions = {
	commentsEnabled: false,
	showAuthor: false,
	menuPadding: false,
	templateFile: config.viewMain,
}

const defaultMeta = {
	title: 'Шлиссельбургская Детская Художественная Школа',
	description: 'Сайт Шлиссельбургской художественной школы',
	image: 'https://art.shlisselburg.org/entrance.jpg',
}

function isActive(path, menuItem) {
	return isEqualPate(path, menuItem.url, true)
}

function isHighlighted(path, menuItem) {
	return any(flatMenuItem(menuItem)
		.map(i => isMatchPathPattern(
			compose(urlToPattern, getPathWithNoTrailingSlash)(i.url),
			path,
			true
		))
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
		active: isActive(path, item),
		highlighted: isHighlighted(path, item),
	}))
	return {items}
}

const getTitle = meta => 'title' in meta
	? meta.title
	: 'Шлиссельбургская художественная школа'

const isHtml = data => typeof data === 'string'

async function render(path, data, meta, options = {}) {
	const renderOptions = {...defaultOptions, ...options}

	const component = isHtml(data)
		? getHtml(data)
		: data

	const menu = buildMenu(path, menuModel)
	const content = renderApp({...renderOptions, menu, component})

	const source = await readFile(renderOptions.templateFile, 'utf-8')
	const template = handlebars.compile(source)

	const metaData = {
		...defaultMeta,
		...meta,
		url: `https://art.shlisselburg.org${path}`,
	}

	return template({
		content,
		options: renderOptions,
		title: getTitle(meta),
		meta: metaData,
	})
}

exports.render = render
