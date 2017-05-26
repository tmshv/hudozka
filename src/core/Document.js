const Data = require('./Data')
const Image = require('./Image')
const {find, findOne} = require('../lib/store')

const store = () => Data.getStore(Document)

class Document {
	static async find(query, options = {}) {
		const items = await find(store(), query, options)

		return Promise.all(items.map(processDocument))
	}

	static async findById(id) {
		const data = await findOne(store(), {id})
		if (!data) return null

		return processDocument(data)
	}

	constructor(data) {
		this.id = data.id
		this.hash = data.hash
		this.file = new DocumentFile(data.file)
		this.type = data.type
		this.title = data.title
		this.category = data.category
		this.url = data.url

		this.preview = data.preview
		this.viewUrl = `/document/${this.id}`
	}
}

class DocumentFile {
	constructor(data) {
		this.name = data.name
		this.size = data.size
	}
}

const
	processDocument = async data => {
		const imageId = data.preview
		const preview = await Image.findById(imageId)

		return new Document({
			...data,
			preview,
		})
	}

module
	.exports = Document
