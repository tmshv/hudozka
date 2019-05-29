/**
 * f([x, y, z, ...], [m, n, k, ...]) -> [[x, m], [y, n], [z, k], ...]
 * @param list1
 * @param list2
 */
export function zip(list1, list2) {
	const [small, other] = list1.length <= list2.length
		? [list1, list2]
		: [list2, list1]
	return small.map((s, i) => [s, other[i]])
}

/**
 * f(g, [x, y, z, ...], [m, n, k, ...]) -> [[x, m], [y, n], [z, k], ...] based on G
 * @param list1
 * @param list2
 */
export function zipBy (key, list1, list2) {
    const [small, other] = list1.length <= list2.length
        ? [list1, list2]
        : [list2, list1]

    return small.map(s => {
        const k = key(s)
        const o = other.find(i => key(i) === k)
        return [s, o]
    })
}


export function arraysIsEqual(list1, list2){
	if (list1.length !== list2.length) return false

	const booleans = zip(list1, list2)
		.map((a, b) => a === b)
	return all(booleans)
}

export function all(list){
	return list
		.map(Boolean)
		.reduce((acc, i) => acc && i, true)
}

export function any(list){
	return list
		.map(Boolean)
		.reduce((acc, i) => acc || i, false)
}

export function exist(value){
	return all([
		value !== null,
		value !== undefined,
	])
}

/**
 * f(g) -> m(x) -> g(x) -> x
 *
 * @param fn
 * @returns {function(*)}
 */
export function pass(fn) {
	return x => {
		fn(x)
		return x
	}
}

/**
 * f(n) -> g(x) -> {[n]: x}
 *
 * @param name
 * @returns {function(*): {}}
 */
export function pack(name) {
	//return value => {[name]: value}

	return value => ({[name]: value})
}

/**
 * f(g, m, ...) -> g . m . ...
 *
 * @param functions
 * @returns {function(*=): *}
 */
export function compose(...functions) {
	const fs = functions.reverse()
	return (...value) => fs.reduce((acc, fn) => fn(...acc), value)
}

/**
 * f(t, g) -> g(x) after t milliseconds
 *
 * @param ms
 * @param callback
 * @returns {function(...[*])}
 */
export function debounce(ms, callback) {
	let id = 0
	return (...args) => {
		clearTimeout(id)
		id = setTimeout(callback, ms, ...args)
	}
}
