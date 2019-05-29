export default class Token {
	static test(data) {
		return true
	}

	constructor({name, data, component}) {
		this.name = name
		this.data = data
		this.component = component
		this.joinable = true

		this.compiledData = null
	}

	isJoinable() {
		return this.joinable
	}

	render() {
		if (!this.compiledData) {
			throw new Error('Token not compiled. Call Token::compile before.')
		}
		return this.component(this.compiledData)
	}

	async getData() {
		return this.data
	}

	async compile() {
		this.compiledData = await this.getData()
		return this
	}

	merge(token) {
		return this
	}

	getMergeOptions(extend) {
		return {
			name: this.name,
			data: this.data,
			component: this.component,
			...extend,
		}
	}

	toString() {
		return `[Token ${this.name} ${this.data}]`
	}
}
