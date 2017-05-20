function getPathWithNoTrailingSlash(path) {
	return path.charAt(path.length - 1) === '/'
		? path.substr(0, path.length - 1)
		: path
}

function isEqualPath(a, b, ignoreTrailingSlash = false) {
	return ignoreTrailingSlash
		? getPathWithNoTrailingSlash(a) === getPathWithNoTrailingSlash(b)
		: a === b
}

exports.getPathWithNoTrailingSlash = getPathWithNoTrailingSlash
exports.isEqualPath = isEqualPath
