import { Collection } from 'mongodb'
import * as db from '../db'

const store = new Map<string, Collection>()

export default class Data {
    static setStore(key: string, collection: Collection) {
        store.set(key, collection)
    }

    static getStore<T>(key: string): Collection<T> {
        return store.get(key)
    }

    static getCollection(name: string): Collection {
        return db.collection(name)
    }
}
