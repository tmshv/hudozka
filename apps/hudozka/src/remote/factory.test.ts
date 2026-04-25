import { describe, expect, it } from "vitest"
import { createFeedPages, createTag, createTagPageCards } from "./factory"
import type { PbImage, PbPage, PbTag } from "./types"

function stubPage(overrides: Partial<PbPage> = {}): PbPage {
    return {
        id: "abc123",
        collectionId: "pbc_1125843985",
        collectionName: "pages",
        created: "2026-01-01T00:00:00.000Z",
        updated: "2026-01-01T00:00:00.000Z",
        title: "Test",
        slug: "/test",
        excerpt: "Excerpt",
        date: "2024-01-15",
        cover: "",
        doc: { version: 1, blocks: [] },
        tags: [],
        draft: false,
        ...overrides,
    }
}

describe("createFeedPages", () => {
    it("should map PB pages to feed pages", () => {
        const pages = [stubPage({ id: "x1", title: "Hello", slug: "/hello", date: "2024-03-01", excerpt: "Summary" })]
        const result = createFeedPages(pages)
        expect(result).toEqual([
            {
                id: "x1",
                title: "Hello",
                url: "/hello",
                date: "2024-03-01",
                excerpt: "Summary",
            },
        ])
    })

    it("should filter out pages without date", () => {
        const pages = [stubPage({ id: "a", date: "2024-01-01" }), stubPage({ id: "b", date: "" })]
        const result = createFeedPages(pages)
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("a")
    })

    it("should return empty array for empty input", () => {
        expect(createFeedPages([])).toEqual([])
    })
})

function stubTag(overrides: Partial<PbTag> = {}): PbTag {
    return {
        id: "tag1",
        collectionId: "pbc_tags",
        collectionName: "tags",
        created: "2026-01-01T00:00:00.000Z",
        updated: "2026-01-01T00:00:00.000Z",
        slug: "watercolor",
        label: "Акварель",
        ...overrides,
    }
}

describe("createTag", () => {
    it("maps PB tag to app Tag with href and count", () => {
        const tag = createTag(stubTag(), 7)
        expect(tag).toEqual({
            id: "tag1",
            name: "Акварель",
            slug: "watercolor",
            href: "/tags/watercolor",
            count: 7,
        })
    })
})

function stubImage(overrides: Partial<PbImage> = {}): PbImage {
    return {
        id: "img1",
        collectionId: "pbc_images",
        collectionName: "images",
        created: "2026-01-01T00:00:00.000Z",
        updated: "2026-01-01T00:00:00.000Z",
        file: "cover.jpg",
        filename: "cover.jpg",
        width: 800,
        height: 600,
        blurhash: "",
        alt: "",
        caption: "",
        ...overrides,
    }
}

describe("createTagPageCards", () => {
    it("maps pages to non-featured cards with their covers", () => {
        const pages = [stubPage({ id: "p1", title: "Hello", slug: "/hello", cover: "img1", date: "2024-03-01" })]
        const images = new Map<string, PbImage>([["img1", stubImage({ id: "img1" })]])

        const result = createTagPageCards(pages, images)

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("p1")
        expect(result[0].url).toBe("/hello")
        expect(result[0].title).toBe("Hello")
        expect(result[0].featured).toBe(false)
        expect(result[0].date).toBe("2024-03-01")
        expect(result[0].cover.width).toBe(800)
    })

    it("falls back to default cover when image is missing", () => {
        const pages = [stubPage({ id: "p1", cover: "missing" })]
        const images = new Map<string, PbImage>()

        const result = createTagPageCards(pages, images)

        expect(result[0].cover.src).toBe("/static/img/main.jpg")
    })

    it("keeps order from input and uses null for empty date", () => {
        const pages = [stubPage({ id: "a", date: "2024-03-01" }), stubPage({ id: "b", date: "" })]
        const result = createTagPageCards(pages, new Map())
        expect(result.map(c => c.id)).toEqual(["a", "b"])
        expect(result[1].date).toBeNull()
    })
})
