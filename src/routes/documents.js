import compose from 'koa-compose'
import route from 'koa-route'
import {index, json, accepts} from './'
import {c} from '../core/db'

async function exists(ctx, id) {
	let i = await c('documents').findOne({id: id})
	return Boolean(i)
}

export default function (store) {
	return compose([
		docs(store),
		documents(),
		document(),
		type()
	])
}

function docs(store) {
	return route.get('/docs', async ctx => {
		const docs = await store.document.find({})
		ctx.body = docs
	})
}

function documents() {
	return route.get('/documents', json(
		async(ctx) => {
			let query = {}
			ctx.body = await c('documents')
				.find(query)
				.toArray()
		}
	))
}

function document() {
	return route.get('/documents/:id', accepts({
		'text/html': index(exists),
		'text/plain': index(exists),
		'application/json': async(ctx, id) => {
			let i = await c('documents').findOne({id: id})
			if (!i) ctx.status = 404
			else {
				i = await populateDocPreview(i)
				ctx.body = i
			}
		}
	}))
}

function type() {
	return route.get('/documents/type/:type', async(ctx, type) => {
		let types = {
			'document': ['documents', {type: 'document'}, populateDocPreview],
			'award': ['documents', {type: 'award'}, populateDocPreview]
		}

		if (type in types) {
			let [collection, query, mapFn] = types[type]

			let docs = await c(collection)
				.find(query)
				.toArray()

			if (mapFn) {
				docs = await Promise.all(
				docs.map(mapFn)
			) }

			ctx.body = docs
		} else {
			ctx.status = 404
		}
	})
}

async function populateDocPreview(doc) {
	doc.preview = await c('images').findOne({_id: doc.preview})
	return doc
}
