const getExt = (name: string) => /\.(\w+)$/.exec(name)[1]
const defaultExt = (ext: string) => ext.toUpperCase()
const exts = ['png', 'pdf', 'jpg', 'jpeg', 'gif', 'doc']
const extd = ['ПНГ', 'ПДФ', 'ЖПГ', 'ЖПГ', 'ГИФ', 'ДОК']
const units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ']

export function ext(filname: string): string {
    const ext = getExt(filname)
    const i = exts.indexOf(ext)

    return i > -1
        ? extd[i]
        : defaultExt(ext)
}

export function size(bytes: any, precision = 1): string {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return ''

    const number = Math.floor(Math.log(bytes) / Math.log(1024))
    const size = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)

    return `${size} ${units[number]}`
}
