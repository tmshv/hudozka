/**
 * Remove trailing spaces from string
 *
 * f(_x_) => x
 *
 * @param str
 */
export function trim(str) {
	return str
		.replace(/^\s+/, '')
		.replace(/\s+$/, '')
}

/**
 * Remove trailing spaces from string
 *
 * f(_x_) => x
 *
 * @param str
 */
export function trimNewline(str) {
	return str
		.replace(/^\n+/, '')
		.replace(/\n+$/, '')
}

export function constrain(n, min, max) {
	if (n < min) return min
	if (n > max) return max
	return n
}
