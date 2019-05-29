import {isUrl} from './index'
import React from 'react'
import UrlToken from './UrlToken'

export default class YoutubeToken extends UrlToken {
	static test(data) {
		if (!isUrl(data)) {
			return false
		}

		const url = new URL(data)
		return ['www.youtube.com', 'youtube.com']
			.includes(url.hostname)
	}

	async getData() {
		const url = new URL(this.data)

		const youtubeId = url.searchParams.get('v')
		return {
			url: `//www.youtube.com/embed/${youtubeId}`
		}
	}
}
