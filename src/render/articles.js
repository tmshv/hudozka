const React = require('react')
const Article = require('../core/Article')
const ArticleComponent = require('../components/Article')
const ArticleCardList = require('../components/ArticleCardList')
const {render} = require('../lib/render')
const timestamp = require('../lib/date').timestamp
const ImageArtifactType = require('../core/ImageArtifactType')
const {sortBy} = require('../utils/sort')
const getHtml = require('../lib/component').getHtml

const sortArticleByDate = sortBy(
	x => timestamp(new Date(x.date))
)

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

async function findArticlesNin(nin, skip, limit, sort) {
	const query = {
		_id: {$nin: nin}
	}

	return Article.find(query, {
		sort,
		skip,
		limit,
	})
}

async function createArticleCardList(page, pageSize) {
	const limit = pageSize
	const skip = (page - 1) * pageSize

	const pinnedArticles = page === 1
		? await Article.findPinned()
		: []

	const total = await Article.total()
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
		.map(x => x.plain())
		.map(x => ({
			...x,
			preview: !x.preview ? null : (
				x.preview.getPicture(ImageArtifactType.MEDIUM)
			)
		}))

	return (
		<ArticleCardList
			articles={content}
			prevPage={prevPage}
			nextPage={nextPage}
		/>
	)
}

async function renderArticles(path, page, pageSize) {
	const articles = await createArticleCardList(page, pageSize)

	const Component = (
		<div className="content content_wide">
			{articles}
		</div>
	)

	return render(path, Component, getMeta({title: `Статьи`}))
}

async function renderArticle(id) {
	const article = await Article.findById(id)
	if (!article) return null

	const Component = (
		<div className="content content_thin">
			<ArticleComponent
				title={article.title}
				date={article.date}
				tags={article.tags}
				shareable={true}
			>
				{getHtml(article.post)}
			</ArticleComponent>
		</div>
	)

	return render(article.url, Component, getMeta(article), {commentsEnabled: true, menuPadding: true})
}

exports.createArticleCardList = createArticleCardList
exports.renderArticles = renderArticles
exports.renderArticle = renderArticle
