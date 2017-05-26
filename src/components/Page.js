const React = require('react')
const Share = require('./Share')
const getHtml = require('../lib/component').getHtml

const Page = ({children, shareable}) => (
	<div className="cloud-page__body">
		{getHtml(children)}

		{!shareable ? null : (
			<Share/>
		)}
	</div>
)

module.exports = Page
