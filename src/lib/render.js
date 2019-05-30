const {readFile} = require('async-file')
const handlebars = require('handlebars')

const renderApp = require('../lib/component').renderApp
const getHtml = require('../lib/component').getHtml

const menuModel = require('../models/menu').default
const buildMenu = require('../menu').buildMenu
const {viewMain, viewEdit} = require('../config')

const defaultOptions = {
	commentsEnabled: false,
	showAuthor: false,
	menuPadding: false,
	templateFile: viewMain,
}

const defaultMeta = {
	title: 'Шлиссельбургская Детская Художественная Школа',
	description: 'Сайт Шлиссельбургской художественной школы',
	image: 'https://art.shlisselburg.org/entrance.jpg',
	imageWidth: 1200,
	imageHeight: 630,
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

async function renderEdit() {
	const renderOptions = {
		...defaultOptions,
		templateFile: viewEdit,
	}

	const source = await readFile(renderOptions.templateFile, 'utf-8')
	const template = handlebars.compile(source)

	return template({})
}

exports.render = render
exports.renderEdit = renderEdit
