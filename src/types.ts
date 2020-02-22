export interface IMenu {
    name: string
    href: string
    active: boolean
    items?: IMenu[]
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
