const React = require('react')
const Share = require('./Share')
const getHtml = require('../lib/component').getHtml

const Page = ({children, shareable}) => (
	<div className="Article Article--cloud">
		<div className="Article-Body">
			{getHtml(children)}
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</div>
)

module.exports = Page
