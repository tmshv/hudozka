const React = require('react')
const Paginator = require('./Paginator')
const Article = require('./Article')

const ArticleList = ({articles, nextPage, prevPage}) => (
	<div>
		{!prevPage ? null : (
			<Paginator url={`/articles/${prevPage}`} type="top"/>
		)}

		{articles.map(article => (
			<Article
				key={article.url}
				url={article.url}
				title={article.title}
				date={article.date}
				data={article.post}
			/>
		))}

		{!nextPage ? null : (
			<Paginator url={`/articles/${nextPage}`} type="bottom"/>
		)}
	</div>
)

module.exports = ArticleList
