const React = require('react')
const {ext, size} = require('../lib/file')
const {titleCase} = require('../lib/string')

const Document = ({title, url, imageUrl, fileUrl, fileName, fileSize}) => (
	<div className="document">
		<div className="document__image">
			<a href={fileUrl} target="_blank" className="invisible">
				<img src={imageUrl} alt={title}/>
			</a>
		</div>

		<div className="document__file">
			<span>{titleCase(title)}</span>
		</div>

		<div className="document__file-info">
			<a href={fileUrl} target="_blank">{ext(fileName)} ({size(fileSize)})</a>
		</div>
	</div>
)

module.exports = Document
