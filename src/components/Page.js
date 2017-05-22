const React = require('react')
const getHtml = require('../lib/component').getHtml

const Page = ({children}) => (
	<div className="content content_thin">
		<div className="cloud-page__body">
			{getHtml(children)}
		</div>
	</div>
)

module.exports = Page
