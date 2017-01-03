require('babel-polyfill')

const Data = require('../lib/Data').default
//const Data = require('../src/Data')
const MongoClient = require('mongodb').MongoClient

MongoClient
	.connect('mongodb://localhost:27017/hudozka')
	.then(function (db) {
		const store = db.collection('documents')
		const data = new Data(store)

		data.find({})
			.then(function(data){
				console.log('data >')
				console.log(data)
			})
	})
