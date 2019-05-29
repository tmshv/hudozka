import {mobileDetectionScreenSize} from '../config'

export const isLandscapeMedia = matchMedia('(orientation: landscape)')

function matchMedia(query) {
	return window.matchMedia(query)
}

export function isMobile() {
	const landscape = isLandscape()
	const mobileWidth = landscape
		? mobileDetectionScreenSize[0]
		: mobileDetectionScreenSize[1]

	const isMobileMedia = matchMedia(`(max-width: ${mobileWidth}px)`)
	return isMobileMedia.matches
}

export function isLandscape(){
	return isLandscapeMedia.matches
}
