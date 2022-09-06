const units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ']

const mime = new Map([
    ['application/pdf', 'ПДФ'],
    ['image/jpeg', 'ЖПГ'],
    ['image/png', 'ПНГ'],
])

export function ext(mimeType: string): string {
    if (mime.has(mimeType)) {
        return mime.get(mimeType)!
    }

    return mimeType
}

export function size(bytes: any, precision = 1): string {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return ''

    const number = Math.floor(Math.log(bytes) / Math.log(1024))
    const size = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)

    return `${size} ${units[number]}`
}
