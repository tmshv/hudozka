function compose(...fns) {
	return value => [...fns]
		.reverse()
		.reduce((acc, fn) => fn(acc), value)
}

/**
 * AND operator for list of values
 *
 * [true, true, true, ...] -> true
 * [false, true, true, ...] -> false
 *
 * @param list
 * @return {boolean}
 */
function all(list) {
	return list.reduce((t, i) => t && i, true)
}

/**
 * OR operator for list of values
 *
 * [true, true, true, ...] -> true
 * [false, true, true, ...] -> true
 * [false, false, false, ...] -> false
 *
 * @param list
 * @return {boolean}
 */
function any(list) {
	return list.reduce((t, i) => t || i, false)
}

/**
 *
 * {a: {}, b: {}, ...} -> Map (a: Class, b: Class)
 *
 * @param Class
 * @param object
 */
function mapOf(Class, object) {
	return Object
		.entries(object)
		.reduce((map, i) => (
			map.set(i[0], new Class(i[1]))
		), new Map())
}

exports.compose = compose
exports.all = all
exports.any = any
exports.mapOf = mapOf
