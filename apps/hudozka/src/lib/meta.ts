import type { Metadata } from "next"
import type { Meta, Pic } from "@/types"

export function meta(props: Partial<Meta>): Meta {
    const path = props.url || "/"
    const url = `https://art.shlisselburg.org${path}`

    return {
        title: "Шлиссельбургская ДХШ",
        description: "Сайт Шлиссельбургской художественной школы",
        image: "https://art.shlisselburg.org/entrance.jpg",
        imageWidth: 1200,
        imageHeight: 630,

        siteName: "Шлиссельбургская Детская Художественная Школа",
        locale: "ru_RU",
        type: "website",
        domain: "art.shlisselburg.org",
        twitterCard: "summary_large_image",
        twitterSite: "@",
        twitterCreator: "@tmshv",

        ...props,
        url,
    }
}

export class MetaBuilder {
    private image?: Pic
    private title?: string
    private description?: string
    private data?: Partial<Meta>

    setData(param: Partial<Meta>) {
        this.data = param
        return this
    }

    setTitle(param: string) {
        this.title = param
        return this
    }

    setDescription(param: string) {
        this.description = param
        return this
    }

    setImage(param: Pic) {
        this.image = param
        return this
    }

    build() {
        const image = this.buildImage()

        const params: Record<string, string> = {}
        if (this.title) {
            params.title = this.title
        }
        if (this.description) {
            params.description = this.description
        }

        return meta({
            ...this.data,
            ...image,
            ...params,
        })
    }

    private buildImage() {
        if (!this.image) {
            return null
        }

        return {
            image: this.image.src,
            imageWidth: this.image.width,
            imageHeight: this.image.height,
        }
    }
}

export function buildMetadata(m: Meta): Metadata {
    return {
        title: m.title,
        description: m.description,
        openGraph: {
            url: m.url,
            title: m.title,
            description: m.description,
            siteName: m.siteName,
            locale: m.locale,
            type: m.type as "website",
            images: [{ url: m.image, width: m.imageWidth, height: m.imageHeight }],
        },
        twitter: {
            card: m.twitterCard as "summary_large_image",
            site: m.twitterSite,
            creator: m.twitterCreator,
        },
    }
}
