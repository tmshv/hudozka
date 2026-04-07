// -- PocketBase record base --

export type PbRecord = {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
}

// -- PocketBase collection types --

export type PbImage = PbRecord & {
    file: string
    filename: string
    width: number
    height: number
    blurhash: string
    alt: string
    caption: string
}

export type PbFile = PbRecord & {
    file: string
    filename: string
}

export type PbPage = PbRecord & {
    title: string
    slug: string
    excerpt: string
    date: string
    cover: string
    doc: DocV1
    tags: string[]
    published: boolean
    draft: DocV1 | null
}

// -- DocV1 document format --

export type DocV1BlockText = {
    type: "text"
    id: string
    text: string
}

export type DocV1BlockImage = {
    type: "image"
    id: string
    image: string
    wide: boolean
    caption: string
}

export type DocV1BlockDocument = {
    type: "document"
    id: string
    file: string
    title: string
}

export type DocV1BlockEmbed = {
    type: "embed"
    id: string
    src: string
}

export type DocV1BlockCardGridItem = {
    page: string
    layout: "small" | "medium" | "big"
}

export type DocV1BlockCardGrid = {
    type: "card-grid"
    id: string
    items: DocV1BlockCardGridItem[]
}

export type DocV1Block =
    | DocV1BlockText
    | DocV1BlockImage
    | DocV1BlockDocument
    | DocV1BlockEmbed
    | DocV1BlockCardGrid

export type DocV1 = {
    version: 1
    blocks: DocV1Block[]
}
