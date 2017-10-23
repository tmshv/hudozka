const Data = require('./Data')
const Image = require('./Image')
const {find, findOne} = require('../lib/store')

const store = () => Data.getStore(Teacher)

class Teacher {
	static async find(query, options = {}) {
		const items = await find(store(), query, options)

		return Promise.all(items.map(processProfile))
	}

	static async findById(id) {
		const data = await findOne(store(), {id})
		if (!data) return null

		return processProfile(data)
	}

	constructor(data) {
		this.id = data.id
		this.post = data.post
		this.file = data.file
		this.edu = data.edu
		this.picture = data.picture
		this.diploma = data.diploma
		this.position = data.position
		this.name = data.name
		this.status = data.status
		this.hash = data.hash

		this.url = `/teacher/${this.id}`
	}

	/**
	 *
	 * "First Middle Last" -> "F. M. Last"
	 *
	 * @returns {string}
	 */
	shortName() {
		const f = i => i.replace(/^(.).+/, '$1')
		const [first, middle, last] = this.splitName()

		return `${f(first)}. ${f(middle)}. ${last}`
	}

	/**
	 *
	 * "First Middle Last" -> ["First", "Middle", "Last"]
	 *
	 * @returns {Array|{index: number, input: string}}
	 */
	splitName() {
		const name = this.name
		const m = /(.+)\s(.+)\s(.+)/.exec(name)
		return m.slice(1)
	}
}

const processProfile = async profile => {
	const imageId = profile.picture
	const picture = await Image.findById(imageId)

	return new Teacher({
		...profile,
		picture,
	})
}

module.exports = Teacher
