import ImageArtifactType from '../core/ImageArtifactType'

export type ImageArtifactDto = {
    height: number
    width: number
    src: string
    set: Array<{
        density: number
        url: string
    }>
}

export type ImageDto = {
    artifacts: {
        original: ImageArtifactDto,
        large: ImageArtifactDto,
        big: ImageArtifactDto,
        medium: ImageArtifactDto,
        small: ImageArtifactDto,
        fb: ImageArtifactDto,
    },
    hash: string
    file: string
}

export function encodeImage(image): ImageDto {
    const artifacts = [
        ImageArtifactType.SMALL,
        ImageArtifactType.MEDIUM,
        ImageArtifactType.BIG,
        ImageArtifactType.LARGE,
        ImageArtifactType.ORIGIN,
        ImageArtifactType.ORIGINAL,
        ImageArtifactType.FACEBOOK = 'fb'
    ].reduce((acc, size) => {
        return {
            ...acc,
            [size]: image.getPicture(size),
        }
    }, {})

    return {
        artifacts: artifacts as any,
        hash: image.hash,
        file: image.file,
    }
}
