import type { DocV1 } from "./doc"

export type PbRecord = {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
}

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
    mime: string
    size: number
    title: string
    preview: string
}

export type PbPage = PbRecord & {
    title: string
    slug: string
    excerpt: string
    date: string
    cover: string
    doc: DocV1
    tags: string[]
    draft: boolean
    parent?: string | string[]
}

export type PbTag = PbRecord & {
    slug: string
    label: string
}

export type PbKv = PbRecord & {
    key: string
    data: unknown
}

export type PbHomeData = {
    cards: { page: string; layout: "small" | "medium" | "big" }[]
}

export type PbMenuData = {
    homeLabel: string
    items: { page: string }[]
}
