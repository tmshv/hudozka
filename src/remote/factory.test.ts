import { describe, it, expect } from "vitest"
import { createFeedPages } from "./factory"
import type { StrapiPage, StrapiTag } from "./types"

function stubPage(overrides: Partial<StrapiPage> = {}): StrapiPage {
    return {
        id: 1,
        title: "Test",
        excerpt: "Excerpt",
        slug: "/test",
        date: "2024-01-15",
        published_at: "",
        created_at: "",
        updated_at: "",
        content: [],
        tags: [] as StrapiTag[],
        ...overrides,
    }
}

describe("createFeedPages", () => {
    it("should map strapi pages to feed pages", () => {
        const pages = [stubPage({ id: 42, title: "Hello", slug: "/hello", date: "2024-03-01", excerpt: "Summary" })]
        const result = createFeedPages(pages)
        expect(result).toEqual([{
            id: "42",
            title: "Hello",
            url: "/hello",
            date: "2024-03-01",
            excerpt: "Summary",
        }])
    })

    it("should filter out pages without date", () => {
        const pages = [
            stubPage({ id: 1, date: "2024-01-01" }),
            stubPage({ id: 2, date: null }),
        ]
        const result = createFeedPages(pages)
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("1")
    })

    it("should return empty array for empty input", () => {
        expect(createFeedPages([])).toEqual([])
    })

    it("should convert numeric id to string", () => {
        const result = createFeedPages([stubPage({ id: 99 })])
        expect(result[0].id).toBe("99")
    })
})
