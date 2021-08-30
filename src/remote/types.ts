type StrapiMediaObject = {
    url: string,
    name: string,
    hash: string,
    ext: string,
    mime: string,
    width: number,
    height: number,
    size: number,
    // "path": null,
}

export type StrapiMedia = StrapiMediaObject & {
    id: number,
    alternativeText: string | null,
    caption: string | null,
    // "previewUrl": null,
    // "provider": "digitalocean",
    // "provider_metadata": null,
    // "created_at": "2021-01-31T20:55:04.027Z",
    // "updated_at": "2021-01-31T20:55:04.027Z"
    formats: null | {
        thumbnail: StrapiMediaObject,
        large: StrapiMediaObject,
        medium: StrapiMediaObject,
        small: StrapiMediaObject,
    },
}

type StrapiComponentText = {
    __component: "hudozka.text",
    id: number,
    text: string,
}

type StrapiComponentImage = {
    __component: "hudozka.image",
    id: number,
    wide: boolean,
    caption: string,
    media: StrapiMedia,
}

type StrapiComponentDocument = {
    __component: "hudozka.document",
    id: number,
    title: string,
    media: StrapiMediaObject
    // "media": {
    //     "id": 210,
    //     "name": "Положение.pdf",
    //     // "alternativeText": null,
    //     // "caption": null,
    //     // "width": null,
    //     // "height": null,
    //     // "formats": null,
    //     // "hash": "Polozhenie_efaf157737",
    //     // "ext": ".pdf",
    //     // "mime": "application/pdf",
    //     // "size": 103.79,
    //     "url": "https://hudozkacdn.tmshv.com/Polozhenie_efaf157737.pdf",
    //     // "previewUrl": null,
    //     // "provider": "digitalocean",
    //     // "provider_metadata": null,
    //     // "created_at": "2021-01-31T21:14:03.158Z",
    //     // "updated_at": "2021-01-31T21:14:03.158Z",
    // }
}

export type StrapiComponentEmbed = {
    __component: "hudozka.embed",
    id: number,
    src: string,
}

export type StrapiComponentCardGrid = {
    __component: "hudozka.card-grid",
    id: number,
    items: StrapiPageCard[],
}

export type StrapiComponent =
    | StrapiComponentText
    | StrapiComponentImage
    | StrapiComponentDocument
    | StrapiComponentEmbed
    | StrapiComponentCardGrid

export type StrapiTag = {
    id: number,
    slug: string,
    name: string,
    // "page": 114,
    // "created_at": "2021-01-31T20:38:39.373Z",
    // "updated_at": "2021-02-17T07:37:54.749Z"
}

export type StrapiPage = {
    id: number,
    title: string,
    excerpt: string,
    slug: string,
    date: string | null,
    cover?: StrapiMedia,
    published_at: string,
    created_at: string,
    updated_at: string,
    content: StrapiComponent[],
    tags: StrapiTag[],
    // "breadcrumbs": [],
    // "breadcrumbRelations": []
}

export type StrapiHome = {
    id: number,
    title: string
    cards: StrapiPageCard[]
    // "created_at": "2021-02-04T04:12:38.291Z",
    // "updated_at": "2021-02-04T16:28:30.961Z",
}

export type StrapiPageCard = {
    __component: 'hudozka.page-card',
    id: number,
    page: StrapiPage,
    layout: 'small' | 'medium' | 'big',
}