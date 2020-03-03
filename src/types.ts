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

export interface IPage {
    id: string
    title: string
    url: string
    data: string
    date: string
    preview: ImageDefinition
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

export type ImageArtifact = {
    width: number
    height: number
    src: string
    set: Array<{
        density: number
        url: string
    }>
}

export type ImageDefinition = {
    file: string
    hash: string
    artifacts: {
        original: ImageArtifact
        large?: ImageArtifact
        big?: ImageArtifact
        medium?: ImageArtifact
        small?: ImageArtifact
        fb?: ImageArtifact
    }
}
