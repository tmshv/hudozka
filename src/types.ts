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
    date: string | null
    cover: Pic
}

export type FileDefinition = {
    url: string
    slug: string
    name: string
    cover?: Pic
    file: {
        name: string
        size: number
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
    cover: Pic
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


export interface ITag {
    id: number
    name: string
    slug: string
    href: string
    count: number
}

export type Pic = {
    src: string
    alt?: string
    width: number
    height: number
    caption?: string
    blur?: string
}

export type TextToken = {
    token: "text"
    data: string
}

export type ImageToken = {
    token: "image"
    wide: boolean
    data: Pic
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
    token: "file"
    data: FileTokenData
}

export type HtmlToken = {
    token: "html"
    data: string
}

export type YoutubeToken = {
    token: "youtube"
    data: {
        url: string
    }
}

export type InstagramToken = {
    token: "instagram"
    data: {
        url: string
        embed: string
    }
}

export type GridToken = {
    token: "grid"
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
