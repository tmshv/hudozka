export function getVariable(name, element = document.documentElement) {
	const value = getComputedStyle(element).getPropertyValue(name)
	return parseValue(value)
}

function parseValue(value) {
	const values = /\s*(\d+)(%|px)\s*/.exec(value)
	if (values) {
		const v = Number(values[1])
		// const v = values[1]
		const w = values[2]
		if (w === '%') return v / 100
		return v
	}
	return value
}