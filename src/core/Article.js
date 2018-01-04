const Data = require('./Data')
const Image = require('./Image')
const Config = require('./Config')
const {find, findOne, total} = require('../lib/store')

const store = () => Data.getStore(Article)

function make(C) {
	return x => new C(x)
}

class Article {
	static async find(query, options = {}) {
		const items = await find(store(), query, options)

		return Promise.all(items.map(processArticle))
	}

	static async findById(id) {
		const item = await findOne(store(), {id})

		return !item
			? null
			: processArticle(item)
	}

	static async total(query = {}) {
		return total(store(), query)
	}

	static async findPinned() {
		const now = new Date()
		const query = {until: {$gte: now}}

		return Article.find(query, {
			sort: {date: -1},
		})
	}

	constructor(data) {
		this.id = data.id
		this.images = data.images
		this.post = data.post
		this.folder = data.folder
		this.date = data.date
		this.title = data.title
		this.until = data.until
		this.tags = (data.tags || []).map(make(Tag))
		this.content = data.content
		this.hash = data.hash
		this.type = data.type
		this.origin = data.origin
		this.file = data.file
		this.version = data.version
		this.preview = data.preview

		this.url = `/article/${this.id}`
	}

	plain() {
		return {
			id: this.id,
			images: this.images,
			post: this.post,
			folder: this.folder,
			date: this.date,
			title: this.title,
			until: this.until,
			tags: this.tags,
			content: this.content,
			hash: this.hash,
			type: this.type,
			origin: this.origin,
			file: this.file,
			version: this.version,
			preview: this.preview,
			url: this.url,
		}
	}
}

class Tag {
	constructor(tag) {
		this.name = tag;
	}
}

const previewFromImage = (imgs = []) => imgs.length
	? imgs[0]
	: null

async function resolveDefaultPreview() {
	const config = await Config.findConfig()
	if (!config) return null

	return Image.findByFile(config.articleCardDefaultPreview)
}

async function processArticle(article) {
	let preview = null
	const previewId = article.preview
		? article.preview
		: previewFromImage(article.images)

	if (previewId) {
		preview = await Image.findById(previewId)
	} else {
		preview = await resolveDefaultPreview()
	}

	return new Article({
		...article,
		preview,
	})
}

module.exports = Article
