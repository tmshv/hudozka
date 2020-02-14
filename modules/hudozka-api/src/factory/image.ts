import ImageArtifactType from '../core/ImageArtifactType'

export function encodeImage(image) {
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
        artifacts,
        hash: image.hash,
		file: image.file,
    }
}
