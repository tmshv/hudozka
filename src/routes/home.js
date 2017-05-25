const React = require('react')
const Article = require('../components/Article')
const {get} = require('koa-route')
const {c} = require('../core/db')
const getArticleListComponent = require('./articles').getArticleListComponent
const {render} = require('../lib/render')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const timestamp = require('../lib/date').timestamp
const {sortBy} = require('../utils/sort')

const sortArticleByDate = sortBy(
	i => timestamp(new Date(i.date))
)

const articleUrl = article => `/article/${article.id}`

async function findArticlesNin(nin, skip, limit, sort) {
	return c('articles')
		.find({
			_id: {$nin: nin}
		})
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.toArray()
}

async function findPinned(page) {
	const now = new Date()
	return page !== 1
		? []
		: await c('articles')
			.find({until: {$gte: now}})
			.sort({date: -1})
			.toArray()
}

function getMeta(article) {
	return {
		title: article.title,
	}
}

function getHome(pageSize) {
	return get('/', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const articles = await getArticleListComponent(path, 1, pageSize)

		const Component = (
			<div className="content content_thin">
				<div className="hudozka-title">
					<p>МБУДО</p>
					<h1>Шлиссельбургская детская художественная&nbsp;школа</h1>
				</div>

				{articles}
			</div>
		)

		ctx.body = await render(path, Component, getMeta({title: 'Шлиссельбургская ДХШ'}), {showAuthor: true})
	})
}

exports.getHome = getHome