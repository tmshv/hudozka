const React = require('react')
const Article = require('../components/Article')
const {get} = require('koa-route')
const getArticleListComponent = require('./articles').getArticleListComponent
const {render} = require('../lib/render')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash

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
