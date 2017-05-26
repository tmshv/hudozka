const Data = require('./Data')
const Album = require('./Album')
const Teacher = require('./Teacher')
const Document = require('./Document')
const Image = require('./Image')

const {MongoClient, ObjectId} = require('mongodb')

export var db

export async function connect(uri) {
	const c = await MongoClient.connect(uri)
	db = init(c)
	return db
}

export function collection(name) {
	return db.collection(name)
}

export const c = collection

export function id(i) {
	if (typeof i === 'string') return ObjectId(i)
	else if (i instanceof ObjectId) return i
	else if (i instanceof Object) return '_id' in i ? ObjectId(i._id) : null
	return null
}

function init(db) {
	Data.setStore(Album, db.collection('albums'))
	Data.setStore(Image, db.collection('images'))
	Data.setStore(Teacher, db.collection('collective'))
	Data.setStore(Document, db.collection('documents'))

	return db
}
