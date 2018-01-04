function ext(filname) {
	let getExt = name => /\.(\w+)$/.exec(name)[1]
	let defaultExt = ext => ext.toUpperCase()

	const exts = ['png', 'pdf', 'jpg', 'jpeg', 'gif', 'doc']
	const extd = ['ПНГ', 'ПДФ', 'ЖПГ', 'ЖПГ', 'ГИФ', 'ДОК']

	let ext = getExt(filname)
	const i = exts.indexOf(ext)

	return i > -1
		? extd[i]
		: defaultExt(ext)
}

function size(bytes, precision = 1) {
	if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return ''

	const units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ']
	const number = Math.floor(Math.log(bytes) / Math.log(1024))

	const size = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)
	return `${size} ${units[number]}`
}

exports.ext = ext
exports.size = size
