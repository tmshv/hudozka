import Data from './Data'

export default class Timeline extends Data {
	async create(post) {
		let savePost = async(post) => {
			const id = post.id
			const type = post.type
			const query = {id: id, type: type}

			await this.store.update(query, post, {upsert: true})
			let document = await this.store.find(query).limit(1).toArray()
			return document[0]
		}

		let add = async(post) => {
			let document = post
			if (this.save) {
				document = await savePost(post)
			}

			this.broadcast(document)
			return document
		}

		return add(post)
	}

	add(post) {
		let savePost = async(post) => {
			const id = post.id
			const type = post.type
			const query = {id: id, type: type}

			await this.store.update(query, post, {upsert: true})
			let document = await this.store.find(query).limit(1).toArray()
			return document[0]
		}

		let add = async(post) => {
			let document = post
			if (this.save) {
				document = await savePost(post)
			}

			this.broadcast(document)
			return document
		}

		return add(post)
	}
}
