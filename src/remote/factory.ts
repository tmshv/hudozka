import { getResizedUrl, imageSrc } from "@/lib/image";
import { IPage, Token } from "@/types";
import { asItem } from "./lib";
import { StrapiComponent, StrapiPage } from "./types";

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
                        image_url: getResizedUrl(component.media.url, {
                            width: 200,
                            height: 200,
                            n: 1,
                        }),
                        file_url: component.media.url,
                        title: component.title,
                        file_size: component.media.size * 1000,
                        // file_size: component.media.size,
                        file_format: component.media.mime,
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
        tags: [],
        // breadcrumb?: [],
        featured: false,
    }
}