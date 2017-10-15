const React = require('react')
const getHtml = require('../lib/component').getHtml
const dateFormat = require('../lib/date').dateFormat

const Head = ({date, children}) => (
	<header className="Article-Head">
		<h1>{children}</h1>

		{!date ? null : (
			<p className="date">{dateFormat(date)}</p>
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

const Article = ({children, data, url, title, date, shareable}) => (
	<article className="Article">
		<Head date={date}>
			{title}
		</Head>

		<div className="Article-Body">
			{children || getHtml(data)}
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</article>
)

module.exports = Article
