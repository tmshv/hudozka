import { ImageSize } from 'src/types'

export type ResizeOptions = {
    width: number
    height: number
}

export function resizeImage(src: string, options: ResizeOptions): string {
    if (!src || src === '') {
        return null
    }

    return `https://images.weserv.nl/?url=${src}&w=${options.width}&h=${options.height}&n=-1`
}

export function imageSrcSet(src: string, sizes: ImageSize[]): string {
    const set = sizes
        .map(x => ({
            value: x,
            href: resizeImage(src, {
                width: x,
                height: x,
            }),
        }))

    return set
        .map(x => `${x.href} ${x.value}w`)
        .join(', ')
}
