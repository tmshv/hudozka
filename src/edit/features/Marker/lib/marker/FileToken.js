import React from 'react'

import Token from './Token'
import {trim} from '../fn'
import {getHtml} from './index'


export default class FileToken extends Token {
	static test(data) {
		return is_file(data, documentExtensions + imageExtensions)
	}

	constructor({data}) {
		super({
			name: 'file',
			data,
		})
		this.joinable = false
	}

	async compile() {
		const data = parse_file(this.getData())
		const url = data['file']
		const text = data.caption
			? data.caption
			: url

		return (
			<a href={url}>
				{text}
			</a>
		)
	}
}
