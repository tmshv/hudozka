import ImageArtifactType from '../core/ImageArtifactType'

const sizes = [
    ImageArtifactType.MEDIUM,
    ImageArtifactType.BIG,
    ImageArtifactType.ORIGIN,
]

export function encodeFilePreview(file, sizes) {
    const preview = file.preview
    if (!preview) return null

    const image = preview.findArtifact(sizes)
    if (!image) return null

    return image.url
}

export function encodeFile(file) {
    const imageUrl = encodeFilePreview(file, sizes)
    const category = (file.category || '')
        .replace('Documents/', '')
        .replace('Pages/', '')
        .replace('Articles	/', '')

    return {
        imageUrl,
        category,
        title: file.title,
        fileName: file.fileInfo.name,
        fileSize: file.fileInfo.size,
        fileUrl: file.url,
        url: file.viewUrl,
    }
}
