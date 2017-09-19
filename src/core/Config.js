const Data = require('./Data')
const {findOne} = require('../lib/store')

class Config {
	static get store() {
		return Data.getStore(Config)
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

		this.redirect = new Map(Object
			.entries(data.redirect)
		)
	}
}

module.exports = Config
