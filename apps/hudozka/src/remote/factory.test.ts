import { describe, expect, it } from "vitest"
import { createFeedPages, createTag } from "./factory"
import type { PbPage, PbTag } from "./types"

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
