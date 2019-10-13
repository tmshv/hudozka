function getPathWithNoTrailingSlash(path='') {
	path = path.charAt(path.length - 1) === '/'
		? path.substr(0, path.length - 1)
		: path
	return path.length === 0
		? '/'
		: path
}

function isEqualPath(a, b, ignoreTrailingSlash = false) {
	return ignoreTrailingSlash
		? getPathWithNoTrailingSlash(a) === getPathWithNoTrailingSlash(b)
		: a === b
}

function isMatchPathPattern(pattern, path, ignoreTrailingSlash = false) {
	const test = ignoreTrailingSlash
		? getPathWithNoTrailingSlash(path)
		: path
	return pattern.test(test)
}

/**
 *
 * /article/* -> ^\/article\/[/\w\d-_]+\/?$
 *
 * @param url
 * @return {RegExp}
 */
function urlToPattern(url) {
	const u = url.replace('/*', '[/\\w\\d-_]+')
	const pattern = `^${u}/?$`

	return new RegExp(pattern)
}

exports.getPathWithNoTrailingSlash = getPathWithNoTrailingSlash
exports.isMatchPathPattern = isMatchPathPattern
exports.urlToPattern = urlToPattern
exports.isEqualPath = isEqualPath
