export type ResizeOptions = {
    width: number
    height: number
    n?: number
}

export function getResizedUrl(src: string, options: ResizeOptions): string {
    const n = options.n ?? 1
    if (!src || src === '') {
        return null
    }

    return `https://images.weserv.nl/?url=${src}&w=${options.width}&h=${options.height}&n=${n}`
}
