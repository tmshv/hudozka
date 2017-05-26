/**
 *
 * "First Middle Last" -> "F. M. Last"
 *
 * @param name
 * @returns {string}
 */
export function shortName(name) {
	try {
		const f = i => i.replace(/^(.).+/, '$1')
		const [, first, middle, last] = splitName(name)
		return `${f(first)}. ${f(middle)}. ${last}`
	} catch (e) {
		return name
	}
}

/**
 *
 * "First Middle Last" -> ["First", "Middle", "Last"]
 *
 * @param {string} name
 * @returns {Array|{index: number, input: string}}
 */
export function splitName(name) {
	return /(.+)\s(.+)\s(.+)/.exec(name)
}
