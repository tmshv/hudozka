const Data = require('./Data')
const {findOne} = require('../lib/store')

const store = () => Data.getStore(Image)

class Image {
	static async findById(id) {
		return findOne(store(), {_id: id})
	}
}

module.exports = Image
