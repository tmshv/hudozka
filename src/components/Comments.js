const React = require('react')

const Comments = ({contentClass = 'content_thin'}) => (
	<div className={`content ${contentClass}`}>
		<div id="disqus_thread"/>
	</div>
)

module.exports = Comments
