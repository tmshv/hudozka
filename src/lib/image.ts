import { ImageSize } from 'src/types'

export type ResizeOptions = {
    width: number
    height: number
}

export function getResizedUrl(src: string, options: ResizeOptions): string {
    if (!src || src === '') {
        return null
    }

    return `https://images.weserv.nl/?url=${src}&w=${options.width}&h=${options.height}&n=-1`
}

export function imageSrcSet(src: string, sizes: ImageSize[]): string {
    const set = sizes
        .map(x => ({
            value: x,
            href: getResizedUrl(src, {
                width: x,
                height: x,
            }),
        }))

    return set
        .map(x => `${x.href} ${x.value}w`)
        .join(', ')
}

export function imageSrc(src: string, size: ImageSize): string {
    return getResizedUrl(src, {
        width: size,
        height: size,
    })
}