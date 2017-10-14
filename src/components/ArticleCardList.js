const React = require('react')
const Paginator = require('./Paginator')
const ArticleCard = require('./ArticleCard')

const ArticleCardList = ({articles, nextPage, prevPage}) => (
	<div className="ArticleCardList">
		{!prevPage ? null : (
			<Paginator url={`/articles/${prevPage}`} type="top"/>
		)}

		<div className="ArticleCardList-body">
			{articles.map((article, i) => (
				<ArticleCard
					key={i}
					article={article}
				/>
			))}
		</div>

		{!nextPage ? null : (
			<Paginator url={`/articles/${nextPage}`} type="bottom"/>
		)}
	</div>
)

module.exports = ArticleCardList
