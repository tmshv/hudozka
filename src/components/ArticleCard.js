const React = require('react')
const dateFormat = require('../lib/date').dateFormat
const Image = require('./Image')

const Date = ({children}) => (
	<p className="date">{dateFormat(children)}</p>
)

const Link = ({href, children}) => (
	<a className="invisible" href={href}>
		{children}
	</a>
)

const ArticleCard = ({article}) => (
	<article className="ArticleCard">
		<Link href={article.url}>
			<div className="ArticleCard-image">
				{!article.preview ? null : (
					<Image data={article.preview} alt={article.title}/>
				)}
			</div>

			<div className="ArticleCard-body">
				{article.title}

				{!article.date ? null : (
					<Date>{article.date}</Date>
				)}
			</div>
		</Link>
	</article>
)

module.exports = ArticleCard
