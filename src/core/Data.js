const db = require('./db')

const store = new Map()

class Data {
    static setStore(Class, collection) {
        store.set(Class, collection)
    }

    static getStore(Class) {
        return store.get(Class)
    }

    static getCollection(name) {
        return db.collection(name)
    }
}

module.exports = Data
