import { IMeta, Pic } from 'src/types'

export function meta(props: Partial<IMeta>): IMeta {
    const path = props.url || '/'
    const url = `https://art.shlisselburg.org${path}`

    return {
        title: 'Шлиссельбургская ДХШ',
        description: 'Сайт Шлиссельбургской художественной школы',
        image: 'https://art.shlisselburg.org/entrance.jpg',
        imageWidth: 1200,
        imageHeight: 630,

        siteName: 'Шлиссельбургская Детская Художественная Школа',
        locale: 'ru_RU',
        type: 'website',
        domain: 'art.shlisselburg.org',
        twitterCard: 'summary_large_image',
        twitterSite: '@',
        twitterCreator: '@tmshv',

        ...props,
        url,
    }
}

export class MetaBuilder {
    private image?: Pic
    private title?: string
    private description?: string
    private data?: Partial<IMeta>

    setData(param: Partial<IMeta>) {
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
