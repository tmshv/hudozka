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

const Article = ({children, data, url, title, date, shareable}) => (
	<article className="Article">
		<header className="Article-Head">
			<Head url={url}>{title}</Head>
			{!date ? null : (
				<p className="date">{dateFormat(date)}</p>
			)}
		</header>

		<div className="Article-Body">
			{children || getHtml(data)}
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</article>
)

module.exports = Article
