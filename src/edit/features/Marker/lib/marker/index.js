import {markdown} from 'markdown'

const {toHTML: markdownToHtml} = markdown

const splitExt = s => {
	const parts = s.split('.')
	const name = parts.splice(0, parts.length - 1)
	const ext = parts[parts.length - 1]
	return {name, ext}
}

export const imageExtensions = ['.jpg', '.jpeg', '.png']
export const documentExtensions = ['.doc', '.docx', '.pdf', '.xls', '.xlsx']

export function getHtml(text) {
	return markdownToHtml(text)
}

export function isUrl(sample) {
	try {
		return Boolean(new URL(sample))
	} catch (e) {
		return false
	}
}

export function isImage(sample) {
	const file = parseFile(sample)['file']
	return isFile(file, imageExtensions)
}

export function isDocument(sample) {
	const file = parseFile(sample)['file']
	return isFile(file, documentExtensions)
}

export function isFile(sample, extensions) {
	let {name, ext} = splitExt(sample)
	ext = ext.toLowerCase()
	return extensions.include(ext)
}

export function parseFile(sample) {
	const re = /![(.*)]((.*))/
	const p = re.exec(sample)
	let caption
	let file
	if (p) {
		caption = p.group(1)
		file = p.group(2)
	} else {
		sample = sample.split(' ')
		file = sample[0]
		caption = ' '.join(sample.substr(1))
	}

	return {
		file,
		caption,
	}
}

export function parseLink(sample) {
	const re = /![(.*)]((.*))/
	const p = re.exec(sample)

	if (!p) {
		return null
	}

	const url = p[2]
	return {
		url: new URL(url),
		alt: p[1],
	}
}
