function splitBy(key) {
	return items => {
		return items.reduce((acc, item) => {
			const name = key(item)
			const items = acc.get(name) || []

			return acc.set(key(item), [...items, item])
		}, new Map())
	}
}

exports.splitBy = splitBy
