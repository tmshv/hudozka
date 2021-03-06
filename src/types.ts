export interface IMenu {
    name: string
    href: string
}

export interface IBreadcumbsPart {
    name: string
    href: string
}

export type PageCardDto = {
    id: number
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

export type Sign = {
    date: string
    person: string
    position: string
    signature: string
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
    id: number
    name: string
    slug: string
    href: string
}

export type ImageDefinition = {
    width: number
    height: number
    src: string
    alt?: string
}

export type TextToken = {
    token: 'text'
    data: string
}

export type ImageToken = {
    token: 'image'
    data: {
        src: string
        alt: string
        caption: string
        width: number
        height: number
    }
}

export type FileTokenData = {
    url: string
    slug: string
    image_url: string
    file_url: string
    title: string
    file_size?: number
    file_format: string
}

export type FileToken = {
    token: 'file'
    data: FileTokenData
}

export type HtmlToken = {
    token: 'html'
    data: string
}

export type YoutubeToken = {
    token: 'youtube'
    data: {
        url: string
    }
}

export type InstagramToken = {
    token: 'instagram'
    data: {
        url: string
        embed: string
    }
}

export type GridToken = {
    token: 'grid'
    data: {
        items: PageCardDto[]
    }
}

export type Token =
    | TextToken
    | ImageToken
    | FileToken
    | HtmlToken
    | YoutubeToken
    | InstagramToken
    | GridToken
