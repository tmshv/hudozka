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

exports.compose = compose
exports.all = all
exports.any = any
