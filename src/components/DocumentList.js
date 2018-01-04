const React = require('react')
const Document = require('./DocumentListItem')

const DocumentList = ({documents, name}) => (
	<div className="documents-container">
		<div className="documents-container__head">
			<h2>{name}</h2>
		</div>

		<div className="documents-container__body">
			{documents.map((d, i) => (
				<Document key={i} {...d}/>
			))}
		</div>
	</div>
)

module.exports = DocumentList
