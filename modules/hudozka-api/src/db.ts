import Data from './core/Data'
import { MongoClient, ObjectId, Db } from 'mongodb'

var db: Db

export async function connect(dbName: string, mongoUri: string) {
    if (db) {
        return db
    }
    const connection = await MongoClient.connect(mongoUri, { useUnifiedTopology: true })
    db = init(connection.db(dbName))
    return db
}

export function collection(name: string) {
    return db.collection(name)
}

export type ObjectIdLike = ObjectId | string
export function oid(i: ObjectIdLike | { _id: ObjectIdLike }): ObjectId | null {
    if (i instanceof ObjectId) {
        return i
    } else if (typeof i === 'string') {
        try {
            return new ObjectId(i)
        } catch (error) {
            console.error(error)
            return null
        }
    } else if (i instanceof Object) {
        return '_id' in i ? oid(i._id) : null
    }

    return null
}

function init(db: Db) {
    console.log('INIT DB')

    Data.setStore('Page', db.collection('pages'))
    Data.setStore('Image', db.collection('images'))
    Data.setStore('Document', db.collection('documents'))
    Data.setStore('Settings', db.collection('settings'))

    return db
}
