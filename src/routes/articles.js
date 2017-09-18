const React = require('react')
const {get} = require('koa-route')
const {c} = require('../core/db')
const Article = require('../components/Article')
const ArticleList = require('../components/ArticleList')
const Paginator = require('../components/Paginator')
const {render} = require('../lib/render')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const timestamp = require('../lib/date').timestamp
const ImageArtifactType = require('../core/ImageArtifactType')
const Image = require('../core/Image')
const {sortBy} = require('../utils/sort')
const accepts = require('./index').accepts

const sortArticleByDate = sortBy(
	i => timestamp(new Date(i.date))
)

const articleUrl = article => `/article/${article.id}`

async function findArticle(id) {
	return c('articles').findOne({id: id})
}

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

async function totalArticles() {
	return c('articles')
		.find({})
		.count()
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

async function getArticleListComponent(path, page, pageSize) {
	path = getPathWithNoTrailingSlash(path)

	const limit = pageSize
	const skip = (page - 1) * pageSize

	const pinnedArticles = await findPinned(page)
	const total = await totalArticles()
	const totalPages = total / pageSize

	const id = i => i._id
	const pinnedIds = pinnedArticles.map(id)
	const articles = await findArticlesNin(pinnedIds, skip, limit, {date: -1})

	const prevPage = page > 1
		? page - 1
		: null

	const nextPage = page < totalPages
		? page + 1
		: null

	const content = [
		...pinnedArticles.sort(sortArticleByDate),
		...articles
	]
		.map(article => ({
			...article,
			url: articleUrl(article),
		}))

	return (
		<ArticleList
			articles={content}
			prevPage={prevPage}
			nextPage={nextPage}
		/>
	)
}

function getMeta(article) {
    const types = [
        ImageArtifactType.FACEBOOK,
        ImageArtifactType.MEDIUM,
        ImageArtifactType.BIG,
        ImageArtifactType.ORIGIN,
    ]
    const meta = {
		title: article.title,
	}

    if (article.preview) {
        try {
            const artifact = article.preview.findArtifact(types)
            meta.image = artifact.url
            meta.imageWidth = artifact.width
            meta.imageHeight = artifact.height
        } catch (error) {
            meta.image = 'https://art.shlisselburg.org/entrance.jpg'
            meta.imageWidth = 1200
            meta.imageHeight = 630
        }
    }
    return meta
}

function getArticles(pageSize) {
	return get('/articles/:page?', async (ctx, page) => {
		page = parseInt(page) || 1

		if (page === 1) {
			ctx.redirect('/')
		} else {
			const path = getPathWithNoTrailingSlash(ctx.path)

			const articles = await getArticleListComponent(path, page, pageSize)
			const Component = (
				<div className="content content_thin">
					{articles}
				</div>
			)

			ctx.body = await render(path, Component, getMeta({title: `Статьи`}))
		}
	})
}

function getArticle() {
	return get('/article/:id', accepts({
		'text/html': async (ctx, id) => {
			const path = getPathWithNoTrailingSlash(ctx.path)
			const article = await findArticle(id)

			const previewId = article.preview
				? article.preview
				: article.images[0]
			article.preview = await Image.findById(previewId)

			if (article) {
				const Component = (
					<div className="content content_thin">
						<Article
							title={article.title}
							date={article.date}
							data={article.post}
							shareable={true}
						/>
					</div>
				)

				ctx.type = 'text/html'
				ctx.body = await render(path, Component, getMeta(article), {commentsEnabled: true})
			} else {
				ctx.status = 404
			}
		},
		'application/json': async (ctx, id) => {
			const article = await findArticle(id)

			if (article) {
				ctx.body = article
			} else {
				ctx.status = 404
			}
		}
	}))
}

exports.getArticleListComponent = getArticleListComponent
exports.getArticles = getArticles
exports.getArticle = getArticle
