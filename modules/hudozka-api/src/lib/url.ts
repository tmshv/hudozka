import { Request } from 'express'
import { ensureArray } from './array'

export function dropTrailingSlash(path: string) {
    if (path === '/' || path === '') {
        return '/'
    }

    const lastChar = path.charAt(path.length - 1)
    if (lastChar === '/') {
        return path.substr(0, path.length - 1)
    }

    return path
}

export function getPathWaterfall(path: string): string[] {
    const parts = path
        .split('/')
        .filter(Boolean)
        .reduce((acc, part, index, parts) => {
            const i = index + 1
            const item = `/${parts.slice(0, i).join('/')}`
            return [
                ...acc,
                item
            ]
        }, [])

    return ['/', ...parts]
}

export function readQueryInt(req: Request, key: string) {
    const int = (value: string | string[]) => parseInt(Array.isArray(value)
        ? value[0]
        : value
    )

    return int(req.query[key]) || 0
}

export function readQueryString(req: Request, key: string) {
    return `${req.query[key]}`
}

export function readQueryArray(req: Request, key: string) {
    return ensureArray(req.query[key])
}
