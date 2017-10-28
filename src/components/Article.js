const React = require('react')
const getHtml = require('../lib/component').getHtml
const dateFormat = require('../lib/date').dateFormat

const Tag = ({children}) => (
	<li className="ArticleTags-Item">
		{children}
	</li>
)

const TagList = ({tags}) => (
	<ul className="ArticleTags">
		{tags.map((x, i) => (
			<Tag key={i}># {x.name}</Tag>
		))}
	</ul>
)

const Head = ({date, tags, children}) => (
	<header className="Article-Head">
		<h1>{children}</h1>

		{!date ? null : (
			<p className="date">{dateFormat(date)}</p>
		)}

		{!tags.length ? null : (
			<TagList tags={tags}/>
		)}
	</header>
)

const Share = () => (
	<div className="likely">
		<div className="vkontakte">Поделиться</div>
		<div className="facebook">Поделиться</div>
		<div className="telegram">Отправить</div>
		<div className="twitter">Твитнуть</div>
	</div>
)

const Article = ({children, article, shareable}) => (
	<article className="Article">
		<Head
			date={article.date}
			tags={article.tags}
		>
			{article.title}
		</Head>

		<div className="Article-Body">
			{children || getHtml(article.post)}
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</article>
)

module.exports = Article
