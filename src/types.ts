export interface IMenu {
    name: string
    href: string
}

export interface IBreadcumbsPart {
    name: string
    href: string
}

export interface IPage {
    id: string
    title: string
    url: string
    data: string
    preview: ImageDefinition
    description: string
    tokens: any[]
    breadcrumb?: IBreadcumbsPart[]
}

export interface IDocument {
    category: string
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

export interface IArticle {
    id: string
    date: string
    tags: ITag[]
    post:string
    featured: boolean
    url: string
    title: string
    preview: IImage
}

export type Person = {
    id: string
    position: string
    name: [string, string, string]
    post: string
    diploma: string
    edu: string
    file: string
    hash: string
    shortName: string
    status: string
    url: string
    picture: ImageArtifact
    preview: ImageDefinition
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
