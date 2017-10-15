const React = require('react')
const dateFormat = require('../lib/date').dateFormat

const Date = ({children}) => (
	<p className="date">{dateFormat(children)}</p>
)

const Image = ({data, alt}) => (
	<picture>
		<img
			className="opa"
			alt={alt}
			src={data.src}
			srcSet={data.set.map(({url, density}) => `${url} ${density}x`)}
		/>
	</picture>
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
