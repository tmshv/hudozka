function titleCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function trim(string) {
	return string
		.replace(/^\s+/, '')
		.replace(/\s+$/, '')
}

exports.titleCase = titleCase
exports.trim = trim
