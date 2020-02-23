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
