export class TokenFactory {
	constructor({token, component}) {
		this.token = token
		this.component = component
	}

	test(sample) {
		return this.token.test(sample)
	}

	create(data) {
		const Token = this.token
		return new Token({
			data,
			component: this.component,
		})
	}
}

export class BuildTokenFactory extends TokenFactory {
	constructor({token, build, component}) {
		super({token})
		this.build = build
		this.component = component
	}

	create(data) {
		const Token = this.token
		return new Token({
			data,
			component: this.component,
			build: this.build,
		})
	}
}
