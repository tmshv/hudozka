import React from 'react'

import Token from './Token'
import {isImage, parseFile} from './index'

export class ImageToken extends Token {
	static test(data) {
		return isImage(data)
	}

	constructor({data}) {
		super({
			name: 'image',
			data,
		})
		this.joinable = true
		this.build = null
	}

	merge(token) {
		const mergedToken = new ImageCollectionToken([this.data, token.data])
		mergedToken.build = this.build
		return mergedToken
	}

	async compile() {

	}
}

export class ImageCollectionToken extends ImageToken {
	constructor({data}) {
		super({data})
		this.name = 'image_collection'
		this.build = null
	}

	merge(token) {
		const data = Array.isArray(token.getData())
			? token.getData()
			: [token.getData()]

		const mergedToken = new ImageCollectionToken({
			data: [...self.getData(), ...data]
		})
		mergedToken.build = self.build
		return mergedToken
	}

	async compile() {
		const data = this.parseData()
		let images = []
		for (let x of data) {
			const img = await this.build(x)
			images.push(img)
		}

		return (
			<div className='kazimir__image-collection'>
				<div
					className='fotorama'
					data-width='100%'
					data-ratio='800/600'
				>
					{images.map(({src}) => (
						<img src={src}/>
					))}
				</div>
			</div>
		)
	}

	parseData() {
		return this
			.getData()
			.map(parseFile)
	}
}
