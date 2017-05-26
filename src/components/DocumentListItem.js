const React = require('react')
const {ext, size} = require('../lib/file')
const {titleCase} = require('../lib/string')

const Document = ({title, url, imageUrl, fileUrl, fileName, fileSize}) => (
	<div className="document-row">
		<a href={url} className="invisible">
			<div className="document-row__image">
				<img src={imageUrl} alt={title}/>
			</div>
		</a>

		<div className="document-row__file">
			<a href={url}>{titleCase(title)}</a>
		</div>

		<div className="document-row__file-info">
			<a href={fileUrl} target="_blank">{ext(fileName)} ({size(fileSize)})</a>
		</div>
	</div>
)

module.exports = Document
