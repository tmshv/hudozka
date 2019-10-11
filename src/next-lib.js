import absoluteUrl from 'next-absolute-url'

export function createApiUrl(req, path) {
    const { origin } = absoluteUrl(req, 'localhost:3000')

    return `${origin}${path}`
}
