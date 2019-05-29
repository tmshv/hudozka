import Token from './Token'
import {trim} from '../fn'

export default class SplitToken extends Token {
	static test(data) {
		data = trim(data)
		return data === ''
	}

	constructor(options) {
		super({
			...options,
			name: 'split',
		})
	}

	render() {
		return null
	}

	merge(token) {
		return this
	}
}
