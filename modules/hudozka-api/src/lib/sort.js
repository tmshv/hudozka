function sort(list, fn, reverse = false) {
	return list
		.map(i => [fn(i), i])
		.sort((a, b) => reverse
			? a[0] - b[0]
			: b[0] - a[0])
		.map(i => i[1])
}

function sortBy(fn, reverse = false) {
	return (i1, i2) => {
		const t1 = fn(i1)
		const t2 = fn(i2)

		return reverse
			? t1 - t2
			: t2 - t1
	}
}

exports.sortBy = sortBy
exports.sort = sort
