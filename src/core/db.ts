import Data from './Data'
import Page from './Page'
import Article from './Article'
const Album = require('./Album')
const Teacher = require('./Teacher')
const Document = require('./Document')
const Image = require('./Image')
import Settings from './Config'
const getConfig = require('next/config').default

const { MongoClient, ObjectId } = require('mongodb')

var db

export async function connect() {
    if (db) {
        return db
    }
    const mongoUri = getConfig().serverRuntimeConfig.dbUri
    const connection = await MongoClient.connect(mongoUri)
    db = init(connection)
    return db
}

export function collection(name) {
    return db.collection(name)
}

export function id(i) {
    if (typeof i === 'string') return ObjectId(i)
    else if (i instanceof ObjectId) return i
    else if (i instanceof Object) return '_id' in i ? ObjectId(i._id) : null
    return null
}

function init(db) {
    console.log('INIT DB')

    Data.setStore('Page', db.collection('pages'))
    Data.setStore('Article', db.collection('articles'))
    Data.setStore('Album', db.collection('albums'))
    Data.setStore('Image', db.collection('images'))
    Data.setStore('Teacher', db.collection('collective'))
    Data.setStore('Document', db.collection('documents'))
    Data.setStore('Settings', db.collection('settings'))

    return db
}
