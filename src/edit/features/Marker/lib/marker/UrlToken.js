import Token from './Token'
import {isUrl} from './index'

export default class UrlToken extends Token {
	static test(data) {
		return isUrl(data)
	}

	constructor(options) {
		super({
			...options,
			name: 'url',
		})
		this.joinable = false
	}
}
