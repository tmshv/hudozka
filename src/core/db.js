const Data = require('./Data')
const Page = require('./Page')
const Article = require('./Article')
const Album = require('./Album')
const Teacher = require('./Teacher')
const Document = require('./Document')
const Image = require('./Image')
const Settings = require('./Config')
const getConfig = require('next/config').default

const { MongoClient, ObjectId } = require('mongodb')

var db

async function connect() {
    if (db) {
        return db
    }
    const mongoUri = getConfig().serverRuntimeConfig.dbUri
    const connection = await MongoClient.connect(mongoUri)
    db = init(connection)
    return db
}

function collection(name) {
    return db.collection(name)
}

function id(i) {
    if (typeof i === 'string') return ObjectId(i)
    else if (i instanceof ObjectId) return i
    else if (i instanceof Object) return '_id' in i ? ObjectId(i._id) : null
    return null
}

function init(db) {
    // Data.setStore('Page', db.collection('pages'))
    Data.setStore(Page, db.collection('pages'))
    Data.setStore(Article, db.collection('articles'))
    Data.setStore(Album, db.collection('albums'))
    Data.setStore(Image, db.collection('images'))
    Data.setStore(Teacher, db.collection('collective'))
    Data.setStore(Document, db.collection('documents'))
    Data.setStore(Settings, db.collection('settings'))

    return db
}

exports.connect = connect
exports.collection = collection
exports.c = collection
exports.id = id