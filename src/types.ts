export interface IMenu {
    name: string
    href: string
}

export interface IBreadcumbsPart {
    name: string
    href: string
}

export type PageCardData = {
    url: string
    title: string
    date: Date
    featured?: boolean
    coverSrc?: string
}

export type PageCardDto = {
    url: string
    title: string
    featured: boolean
    date: string
    cover?: ImageDefinition
}

export type FileDefinition = {
    url: string
    slug: string
    name: string
    cover?: ImageDefinition
    file: {
        name: string
        size: string
        type: string
        src: string
    }
}

export interface IPage {
    id: string
    title: string
    url: string
    data: string
    date: string
    cover: ImageDefinition
    description: string
    tokens: any[]
    tags: ITag[]
    breadcrumb?: IBreadcumbsPart[]
    featured: boolean
}

export interface IDocument {
    // category: string
    fileName: string
    fileSize: number
    fileUrl: string
    imageUrl: string
    title: string
    url: string
}

export interface IMeta {
    url: string
    siteName: string
    locale: string
    type: string
    description: string
    domain: string
    title: string
    image: string
    imageWidth: number
    imageHeight: number
    twitterCard: string
    twitterSite: string
    twitterCreator: string
}

export interface IImage {
    alt: string
    src: string
    srcSet: Array<{ url: string, density: number }>
    set: any // TODO
}

export interface ITag {
    name: string
    slug: string
    href: string
}

export enum ImageSize {
    big = 3000,
    large = 1500,
    medium = 1000,
    small = 500,
    thumbnail = 200,
}

export type ImageDefinition = {
    width: number
    height: number
    src: string
}
