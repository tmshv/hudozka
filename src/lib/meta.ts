import { IMeta, ImageDefinition } from 'src/types'

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
    private image: ImageDefinition
    private title: string
    private description: string
    private data: Partial<IMeta>

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

    setImage(param: ImageDefinition) {
        this.image = param
        return this
    }

    build() {
        const image = this.buildImage()

        return meta({
            ...this.data,
            ...image,
            title: this.title ?? null,
            description: this.description ?? null,
        })
    }

    private buildImage() {
        if (!this.image) {
            return null
        }

        const artifact = this.image.artifacts.fb
        return {
            image: artifact.src,
            imageWidth: artifact.width,
            imageHeight: artifact.height,
        }
    }
}
