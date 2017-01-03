import {EventEmitter} from 'events'

export default class Data extends EventEmitter {
	constructor(store) {
		super()
		this.save = true
		this.store = store
	}

	broadcast(data) {
		this.emit('update', data)
	}

	disableSaving() {
		this.save = false
	}

	enableSaving() {
		this.save = true
	}

	async create(data) {
		const id = data.id
		if (!id) throw new Error('Field `id` not found in Data object')
		const query = {id: id}

		await this.store.update(query, data, {upsert: true})
		const result = await this.store.findOne(query)
		this.emit('update', result)
		return result
	}

	async read(id) {
		return this.store.findOne({id: id})
	}

	async find(query, skip = 0, limit = 0) {
		const cursor = this.store
			.find(query)
			.skip(skip)
		if (limit) cursor.limit(limit)
		return await cursor.toArray()
	}
}
