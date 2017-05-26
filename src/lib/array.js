function splitBy(key) {
	return items => {
		return items.reduce((acc, item) => {
			const name = key(item)
			const items = acc.get(name) || []

			return acc.set(key(item), [...items, item])
		}, new Map())
	}
}

function head(list) {
	return Array.isArray(list) && list.length
		? list[0]
		: null
}

function last(list) {
	return Array.isArray(list) && list.length
		? list[list.length - 1]
		: null
}

exports.splitBy = splitBy
exports.head = head
exports.last = last
