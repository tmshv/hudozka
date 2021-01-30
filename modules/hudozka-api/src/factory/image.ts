import Image from '../core/Image'

const ORIGINAL = 'original'

export type ImageDto = {
    width: number
    height: number
    src: string
    filepath: string
}

export function encodeImage(image: Image): ImageDto {
    const a = image.getArtifact(ORIGINAL)
    if (!image) {
        return null
    }

    return {
        src: a.url,
        width: a.width,
        height: a.height,
        filepath: image.file,
    }
}
