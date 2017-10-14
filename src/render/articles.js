const React = require('react')
const Article = require('../core/Article')
const ArticleCardList = require('../components/ArticleCardList')
const timestamp = require('../lib/date').timestamp
const ImageArtifactType = require('../core/ImageArtifactType')
const {sortBy} = require('../utils/sort')

const sortArticleByDate = sortBy(
	x => timestamp(new Date(x.date))
)

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

exports.createArticleCardList = createArticleCardList
