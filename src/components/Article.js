const React = require('react')
const getHtml = require('../lib/component').getHtml
const dateFormat = require('../lib/date').dateFormat

const Head = ({url, children}) => (
	!url
		? <h1>{children}</h1>
		: <a href={url}><h2>{children}</h2></a>
)

const Share = () => (
	<div className="likely">
		<div className="vkontakte">Поделиться</div>
		<div className="facebook">Поделиться</div>
		<div className="telegram">Отправить</div>
		<div className="twitter">Твитнуть</div>
	</div>
)

const Article = ({data, url, title, date, shareable}) => (
	<article className="article">
		<header className="article__head">
			<Head url={url}>{title}</Head>
			<p className="date">{dateFormat(date)}</p>
		</header>

		<div className="article__body">
			{getHtml(data)}
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</article>
)

module.exports = Article
