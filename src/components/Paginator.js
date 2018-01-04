const React = require('react')

const text = ['↑', '↓']
const linkText = ['Предыдущая страница', 'Следующая страница']

const i = type => type === 'top'
	? 0
	: 1

const Icon = ({children}) => (
	<span className="Paginator-Icon">{children}</span>
)

const Paginator = ({url, type}) => (
	<div className="Paginator">
		<Icon>{text[i(type)]}</Icon>
		<a href={url}>{linkText[i(type)]}</a>
	</div>
)

module.exports = Paginator
