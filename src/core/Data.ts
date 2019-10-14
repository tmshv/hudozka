const db = require('./db')

const store = new Map()

export default class Data {
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
