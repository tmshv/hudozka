import Token from './Token'
import {trim} from '../fn'
import {getHtml} from './index'

export default class TextToken extends Token {
	static test(data) {
		return true
	}

	constructor(options) {
		super({
			...options,
			name: 'text',
		})
	}

	merge(token) {
		const data = [this.data, token.data].join('\n')

		return new TextToken(this.getMergeOptions({
			data: trim(data),
		}))
	}

	async getData() {
		const html = getHtml(this.data)
		return {html}
	}

	// async compile() {
	// 	// return getHtml(this.getData())
	//
	//
	//
	//
	//
	// 	return (
	// 		<div
	// 			className='MarkerWidgetHtml'
	// 			dangerouslySetInnerHTML={{__html: html}}
	// 		/>
	// 	)
	// }
}
