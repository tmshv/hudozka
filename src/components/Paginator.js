const React = require('react')

const text = ['↑ Предыдущая страница', '↓ Следующая страница']
const style = ['article-page-control__top', 'article-page-control__bottom']

const i = type => type === 'top'
	? 0
	: 1

const Paginator = ({url, type}) => (
	<div className={`article-page-control ${style[i(type)]}`}>
		<a href={url}>{text[i(type)]}</a>
	</div>
)

module.exports = Paginator
