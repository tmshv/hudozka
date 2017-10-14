export function sortByPattern(list, pattern, map) {
	let weight = i => {
		const index = pattern.indexOf(map(i))
		return index > -1 ? pattern.length - index : 0
	}

	return sortByWeight(list, weight)
}

export function sortByWeight(list, fn) {
	return list
		.map(i => [fn(i), i])
		.sort((a, b) => b[0] - a[0])
		.map(i => i[1])
}

export function sortBy(fn) {
	return (i1, i2) => {
		let t1 = fn(i1)
		let t2 = fn(i2)

		if (t1 < t2) return 1
		if (t1 > t2) return -1
		return 0
	}
}
