export function splitBy(fn) {
    return items => {
        return items.reduce((acc, item) => {
            const key = fn(item)
			const items = acc.get(key) || []

			return acc.set(key, [...items, item])
		}, new Map())
	}
}

export function head(list) {
	return Array.isArray(list) && list.length
		? list[0]
		: null
}

export function last(list) {
	return Array.isArray(list) && list.length
		? list[list.length - 1]
		: null
}

// exports.splitBy = splitBy
// exports.head = head
// exports.last = last
