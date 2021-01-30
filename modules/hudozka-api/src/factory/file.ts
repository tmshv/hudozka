import Document from '../core/Document'
import { encodeImage, ImageDto } from './image'

export type FileDto = {
    url: string
    slug: string
    name: string
    cover?: ImageDto
    filepath: string
    file: {
        name: string
        size: number
        type: string
        src: string
    }
}

export function encodeFile(file: Document): FileDto {
    const cover = file.preview ? encodeImage(file.preview) : null

    return {
        url: encodeFileUrl(file),
        slug: file.id,
        cover,
        name: file.title,
        filepath: file.file,
        file: {
            type: 'application/pdf',
            name: file.fileInfo.name,
            size: file.fileInfo.size,
            src: file.url,
        }
    }
}

export function encodeFileUrl(file: Document): string {
    return `/document/${file.id}`
}
