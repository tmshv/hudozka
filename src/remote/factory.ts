import type { MenuItem, Page, Tag, PageCardDto, Pic, Token, FeedPage } from "@/types"
import type { PbPage, PbImage, PbFile, PbTag, PbHomeData, PbMenuData } from "./types"
import type { DocV1Block } from "./doc"
import { typograf, markdownToHtml } from "@/lib/text"
import { pb } from "./pb"

const md = (text: string) => typograf(markdownToHtml(text))

const DEFAULT_COVER: Pic = {
    src: "/static/img/main.jpg",
    width: 1920,
    height: 1858,
}

function pbFileUrl(collectionId: string, recordId: string, filename: string): string {
    return `${pb.baseURL}/api/files/${collectionId}/${recordId}/${filename}`
}

function imageRecordToPic(image: PbImage, overrides?: { alt?: string; caption?: string }): Pic {
    const pic: Pic = {
        src: pbFileUrl(image.collectionId, image.id, image.file),
        width: image.width,
        height: image.height,
    }

    const alt = overrides?.alt || image.alt || undefined
    if (alt) {
        pic.alt = alt
    }

    const caption = overrides?.caption || image.caption || undefined
    if (caption) {
        pic.caption = caption
    }

    if (image.blurhash) {
        pic.blur = image.blurhash
    }

    return pic
}

function getCoverPic(coverId: string, images: Map<string, PbImage>): Pic {
    if (coverId) {
        const image = images.get(coverId)
        if (image) {
            return imageRecordToPic(image)
        }
    }
    return DEFAULT_COVER
}

export function isYoutubeUrl(url: string): boolean {
    return /youtube\.com/.test(url)
}

export function createEmbed(src: string): Token {
    if (isYoutubeUrl(src)) {
        return {
            token: "youtube",
            data: { url: src },
        }
    }

    return {
        token: "html",
        data: `<iframe src="${src}" width="100%" height="480" frameborder="0"></iframe>`,
    }
}

export function createPageToken(
    block: DocV1Block,
    images: Map<string, PbImage>,
    files: Map<string, PbFile>,
    cardGridPages: Map<string, PbPage>,
    cardGridImages: Map<string, PbImage>,
): Token {
    switch (block.type) {
    case "text":
        return {
            token: "html",
            data: md(block.text),
        }

    case "image": {
        const image = images.get(block.image)
        if (!image) {
            return { token: "text", data: "" }
        }
        return {
            token: "image",
            wide: block.wide,
            data: imageRecordToPic(image, {
                alt: block.caption,
                caption: block.caption,
            }),
        }
    }

    case "document": {
        const file = files.get(block.file)
        if (!file) {
            return { token: "text", data: "" }
        }
        const fileUrl = pbFileUrl(file.collectionId, file.id, file.file)
        return {
            token: "file",
            data: {
                url: fileUrl,
                slug: "",
                image_url: fileUrl,
                file_url: fileUrl,
                title: block.title,
                file_size: file.size,
                file_format: file.mime,
            },
        }
    }

    case "embed":
        return createEmbed(block.src)

    case "card-grid": {
        const items: PageCardDto[] = block.items
            .map(item => {
                const page = cardGridPages.get(item.page)
                if (!page) {
                    return null
                }
                const cover = getCoverPic(page.cover, cardGridImages)
                return {
                    id: page.id,
                    url: page.slug,
                    title: page.title,
                    featured: item.layout === "big" || item.layout === "medium",
                    date: page.date || null,
                    cover,
                }
            })
            .filter((x): x is PageCardDto => x !== null)
        return {
            token: "grid",
            data: { items },
        }
    }

    default:
        return {
            token: "text",
            data: JSON.stringify(block),
        }
    }
}

export function createPage(
    record: PbPage,
    images: Map<string, PbImage>,
    files: Map<string, PbFile>,
    tags: PbTag[],
    cardGridPages: Map<string, PbPage>,
    cardGridImages: Map<string, PbImage>,
): Page {
    const cover = getCoverPic(record.cover, images)

    const pageTags: Tag[] = tags.map(tag => ({
        id: tag.id,
        name: tag.label,
        slug: tag.slug,
        href: `/tags/${tag.slug}`,
        count: 0,
    }))

    const tokens: Token[] = record.doc.blocks.map(block =>
        createPageToken(block, images, files, cardGridPages, cardGridImages),
    )

    return {
        title: record.title,
        description: record.excerpt,
        id: record.id,
        url: record.slug,
        data: "",
        date: "",
        cover,
        tokens: [
            {
                token: "html",
                data: md(`# ${record.title}`),
            },
            ...tokens,
        ],
        tags: pageTags,
        featured: false,
    }
}

export function createHomeCards(
    data: PbHomeData,
    pages: Map<string, PbPage>,
    images: Map<string, PbImage>,
): PageCardDto[] {
    return data.cards
        .map(card => {
            const page = pages.get(card.page)
            if (!page) {
                return null
            }
            const cover = getCoverPic(page.cover, images)
            return {
                id: page.id,
                url: page.slug,
                title: page.title,
                featured: card.layout === "big" || card.layout === "medium",
                date: page.date || null,
                cover,
            }
        })
        .filter((x): x is PageCardDto => x !== null)
}

export function createMenu(
    data: PbMenuData,
    pages: Map<string, PbPage>,
): MenuItem[] {
    const items: MenuItem[] = data.items
        .map(item => {
            const page = pages.get(item.page)
            if (!page) {
                return null
            }
            return {
                href: page.slug,
                name: page.title,
            }
        })
        .filter((x): x is MenuItem => x !== null)

    return [{
        href: "/",
        name: data.homeLabel,
    }, ...items]
}

export function createFeedPages(pages: PbPage[]): FeedPage[] {
    return pages
        .filter(page => page.date)
        .map(page => ({
            id: page.id,
            title: page.title,
            url: page.slug,
            date: page.date,
            excerpt: page.excerpt,
        }))
}
