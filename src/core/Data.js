const store = new Map()

class Data {
	static setStore(Class, collection) {
		store.set(Class, collection)
	}

	static getStore(Class) {
		return store.get(Class)
	}
}

module.exports = Data
