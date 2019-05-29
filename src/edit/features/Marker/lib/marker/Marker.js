import SplitToken from './SplitToken'

export class Marker {
	constructor() {
		this.tokenFactories = []
		this.treeMiddlewares = []

		this.join = true
		this.blankFactory = null
	}

	async blank({text}) {
		if (!this.blankFactory) {
			throw new Error(`Blank factory is not defined`)
		}
		const token = await this.blankFactory.create(text)
		return token.compile()
	}

	addTokenFactory(tokenFactory, {blank = false} = {}) {
		this.tokenFactories.push(tokenFactory)
		if (blank) {
			this.blankFactory = tokenFactory
		}
		return this
	}

	addTreeMiddleware(callback) {
		this.treeMiddlewares.push(callback)
		return this
	}

	async evaluate(text) {
		let tokens = text.split('\n')
		tokens = this.markupTokens(tokens)
		if (this.join) {
			tokens = this.joinTokens(tokens)
		}

		return compileTokens(tokens)
		// tree = lxml.html.fromstring(compiled)
		// return await self.process_tree(tree)
	}

	joinTokens(tokens) {
		return mergeTokens(joinTokens(tokens))
	}

	async processTree(tree) {
		// for fn in self.treeMiddlewares:
		// tree = await fn(tree)
		// return tree
	}

	markupTokens(tokens) {
		const markedTokens = []

		tokens.forEach(data => {
			const token = this.createToken(data)
			if (!token) {
				throw new Error(`Token not recognized for data ${data}`)
			}

			markedTokens.push(token)
		})

		return markedTokens
	}

	createToken(data) {
		for (let factory of this.tokenFactories) {
			if (factory.test(data)) {
				return factory.create(data)
			}
		}

		return null
	}
}

function joinTokens(tokens) {
	const isSplit = x => x instanceof SplitToken

	let bufferTag = null
	let tokensBuffer = []
	let tokensList = []
	for (let token of tokens) {
		const tag = token.name
		const changed = bufferTag !== null && tag !== bufferTag

		let flush = isSplit(token)
		if (changed) {
			flush = true
		}

		if (!token.isJoinable()) {
			flush = true
		}

		if (flush) {
			if (tokensBuffer.length) {
				tokensList.push(tokensBuffer)
			}

			if (isSplit(token)) {
				tokensBuffer = []
				bufferTag = null
			} else {
				tokensBuffer = [token]
				bufferTag = tag
			}
		} else {
			bufferTag = tag
			tokensBuffer.push(token)
		}
	}

	if (tokensBuffer.length) {
		tokensList.push(tokensBuffer)
	}

	return tokensList
}

function mergeTokens(tokensList) {
	return tokensList
		.map(ts => ts
			.reduce(
				(token, x) => token.merge(x)
			)
		)
}

async function compileTokens(tokens) {
	return Promise.all(
		tokens.map(x => x.compile())
	)
}
