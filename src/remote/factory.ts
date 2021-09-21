import { ImageDefinition, IMenu, IPage, ITag, PageCardDto, Pic, Token } from "@/types";
import { asItem } from "./lib";
import { StrapiComponentEmbed, StrapiComponent, StrapiHome, StrapiPage, StrapiPageCard, StrapiTag, StrapiMedia, StrapiMenu } from "./types";
import { typograf, markdownToHtml } from 'src/lib/text'
import { encodeImageToBlurhash } from "./image";

const md = (text: string) => typograf(markdownToHtml(text))

export function createPageUrls(pages: StrapiPage[]) {
    return {
        items: pages.map(page => page.slug),
    }
}

export function isYoutubeUrl(url: string): boolean {
    return /youtube\.com/.test(url)
}

export function getCoverImage(media?: StrapiMedia) {
    return media ? createImageFromMedia(media) : {
        src: 'https://hudozkacdn.tmshv.com/main_fad9fdf29a.jpg',
        width: 1920,
        height: 1858,
        alt: ''
    }
}

export function createEmbed(component: StrapiComponentEmbed): Token {
    if (isYoutubeUrl(component.src)) {
        return {
            token: 'youtube',
            data: {
                url: component.src,
            }
        }
    }

    return {
        token: 'html',
        data: `<iframe src="${component.src}" width="100%" height="480" frameborder="0"></iframe>`
    }
}

export async function createPageToken(component: StrapiComponent): Promise<Token> {
    switch (component.__component) {
        case 'hudozka.text': {
            return {
                token: 'html',
                data: md(component.text),
            }
        }

        case 'hudozka.image': {
            const src = component.media.formats?.large?.url ?? component.media.url
            const thumb = component.media.formats?.thumbnail?.url ?? component.media.url
            const data: Pic = {
                alt: component.caption,
                caption: component.caption,
                src,
                width: component.media.width,
                height: component.media.height,
            }

            const blur = await encodeImageToBlurhash(thumb)
            if (blur) {
                data.blur = blur
            }

            return {
                token: 'image',
                wide: component.wide,
                data,
            }
        }

        case 'hudozka.document': {
            return {
                token: 'file',
                data: {
                    url: component.media.url,
                    slug: 'jopa',
                    image_url: component.media.url,
                    file_url: component.media.url,
                    title: component.title,
                    file_size: component.media.size * 1000,
                    // file_size: component.media.size,
                    file_format: component.media.mime,
                }
            }
        }

        case 'hudozka.embed': {
            return createEmbed(component)
        }

        case 'hudozka.card-grid': {
            return {
                token: 'grid',
                data: {
                    items: component.items
                        .filter(Boolean)
                        .map(createCardGrid)
                }
            }
        }

        default:
            return {
                token: 'text',
                data: ` ${JSON.stringify(component)}`,
            }
    }
}

export function createMenu(res: StrapiMenu): IMenu[] {
    const items: IMenu[] = res.menu.items.map(x => ({
        href: x.page.slug,
        name: x.page.title,
    }))

    return [{
        href: '/',
        name: res.homeLabel,
    }, ...items]
}

export async function createPage(res: StrapiPage | StrapiPage[]): Promise<IPage | null> {
    const item = asItem(res)
    if (!item) {
        return null
    }

    const cover = getCoverImage(item.cover)
    const tags: ITag[] = item.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        href: `/tags/${tag.slug}`,
    }))

    const tokens = await Promise.all(item.content.map(createPageToken))

    return {
        title: item.title,
        description: item.excerpt,
        id: `${item.id}`,
        url: item.slug,

        data: '',
        date: '',
        cover,
        tokens: [
            {
                token: 'html',
                data: md(`# ${item.title}`),
            },

            ...tokens.filter(Boolean),
        ],
        tags,
        // breadcrumb?: [],
        featured: false,
    }
}

function isCardFeatured(card: StrapiPageCard): boolean {
    return card.layout === 'big' || card.layout === 'medium'
}

function createImageFromMedia(media: StrapiMedia): ImageDefinition {
    return {
        src: media.url,
        width: media.width,
        height: media.height,
        alt: media.alternativeText ?? '',
    }
}

export function createCardGrid(card: StrapiPageCard): PageCardDto {
    const cover = getCoverImage(card.page.cover)

    return {
        id: card.id,
        url: card.page.slug,
        title: card.page.title,
        featured: isCardFeatured(card),
        date: card.page.date,
        cover,
    }
}

export function createHomeCards(data: StrapiHome): PageCardDto[] {
    return data.cards
        .map(createCardGrid)
        .filter(x => !!x.url)
}
