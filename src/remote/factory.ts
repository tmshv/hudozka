import { getResizedUrl } from "@/lib/image";
import { IPage, ITag, PageCardDto, Token } from "@/types";
import { asItem } from "./lib";
import { StrapiComponentEmbed, StrapiComponent, StrapiHome, StrapiPage, StrapiPageCard } from "./types";

export function createPageUrls(pages: StrapiPage[]) {
    return {
        items: pages.map(page => page.slug),
    }
}

export function isYoutubeUrl(url: string): boolean {
    return /youtube\.com/.test(url)
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

export function createPageTokens(components: StrapiComponent[]): Token[] {
    return components.map(component => {
        switch (component.__component) {
            case 'hudozka.text': {
                return {
                    token: 'text',
                    data: component.text,
                }
            }

            case 'hudozka.image': {
                return {
                    token: 'image',
                    data: {
                        alt: component.caption,
                        caption: component.caption,
                        src: component.media.url,
                        width: component.media.width,
                        height: component.media.height,
                    }
                }
            }

            case 'hudozka.document': {
                return {
                    token: 'file',
                    data: {
                        url: component.media.url,
                        slug: 'jopa',
                        image_url: component.media.url,
                        // image_url: getResizedUrl(component.media.url, {
                        //     width: 200,
                        //     height: 200,
                        //     n: 1,
                        // }),
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
                    data: `
                        ${JSON.stringify(component)}
                    `,
                }
        }
    })
}

export function createPage(res: StrapiPage | StrapiPage[]): IPage {
    const item = asItem(res)
    if (!item) {
        return null
    }

    const tags: ITag[] = item.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        href: `/tags/${tag.slug}`,
    }))

    return {
        title: item.title,
        description: item.excerpt,
        id: `${item.id}`,
        url: item.slug,

        data: '',
        date: '',
        cover: {
            src: item.cover.url,
            width: item.cover.width,
            height: item.cover.height,
        },
        tokens: [
            {
                token: 'text',
                data: `# ${item.title}`,
            },

            ...createPageTokens(item.content)
                .filter(Boolean),
        ],
        tags,
        // breadcrumb?: [],
        featured: false,
    }
}

function isCardFeatured(card: StrapiPageCard): boolean {
    return card.layout === 'big' || card.layout === 'medium'
}

export function createCardGrid(card: StrapiPageCard): PageCardDto {
    // const cover = item.coverSrc ?? process.env.APP_CARD_DEFAULT_IMAGE

    return {
        id: card.id,
        // id: card.page.id,
        url: card.page.slug,
        title: card.page.title,
        featured: isCardFeatured(card),
        date: card.page.date,
        cover: {
            src: card.page.cover.url,
            width: card.page.cover.width,
            height: card.page.cover.height,
            alt: card.page.title,
        }
    }
}

export function createHomeCards(data: StrapiHome): PageCardDto[] {
    // const cover = item.coverSrc ?? process.env.APP_CARD_DEFAULT_IMAGE

    return data.cards.map(createCardGrid)
}
