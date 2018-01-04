const Data = require('./Data')
const {findOne} = require('../lib/store')

class Config {
	static get store() {
		return Data.getStore(Config)
	}

	static async findConfig() {
		const config = await Config.findById('settings')
		return config || new Config({})
	}

	static async findById(id) {
		const data = await findOne(Config.store, {id})
		if (!data) return null

		return new Config(data)
	}

	constructor({hash, file, ...data}) {
		this.hash = hash
		this.file = file
		this.server = data.server
		this.articlesPerPage = data.articlesPerPage || 5
		this.collectiveOrder = data.collectiveOrder || []
		this.articleCardDefaultPreview = data.articleCardDefaultPreview
		this.collectiveImage = data.collectiveImage

		const redirect = data.redirect || {}
		this.redirect = new Map(Object
			.entries(redirect)
		)
	}
}

module.exports = Config
