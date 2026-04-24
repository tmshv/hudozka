import { describe, it, expect } from "vitest"
import { meta, MetaBuilder, buildMetadata } from "./meta"

describe("meta", () => {
    it("should return defaults when called with empty object", () => {
        const result = meta({})
        expect(result.title).toBe("Шлиссельбургская ДХШ")
        expect(result.description).toBe("Сайт Шлиссельбургской художественной школы")
        expect(result.url).toBe("https://art.shlisselburg.org/")
        expect(result.locale).toBe("ru_RU")
    })

    it("should override defaults with provided values", () => {
        const result = meta({ title: "Custom Title", url: "/about" })
        expect(result.title).toBe("Custom Title")
        expect(result.url).toBe("https://art.shlisselburg.org/about")
    })

    it("should construct URL from path", () => {
        const result = meta({ url: "/news/2024" })
        expect(result.url).toBe("https://art.shlisselburg.org/news/2024")
    })
})

describe("MetaBuilder", () => {
    it("should support method chaining", () => {
        const builder = new MetaBuilder()
        const result = builder
            .setTitle("Test")
            .setDescription("Desc")
            .build()

        expect(result.title).toBe("Test")
        expect(result.description).toBe("Desc")
    })

    it("should use default meta values", () => {
        const result = new MetaBuilder().build()
        expect(result.locale).toBe("ru_RU")
        expect(result.domain).toBe("art.shlisselburg.org")
    })

    it("should set image from Pic object", () => {
        const result = new MetaBuilder()
            .setImage({ src: "http://example.com/img.jpg", width: 800, height: 600 })
            .build()

        expect(result.image).toBe("http://example.com/img.jpg")
        expect(result.imageWidth).toBe(800)
        expect(result.imageHeight).toBe(600)
    })

    it("should apply data from setData", () => {
        const result = new MetaBuilder()
            .setData({ url: "/test", type: "article" })
            .build()

        expect(result.url).toBe("https://art.shlisselburg.org/test")
        expect(result.type).toBe("article")
    })
})

describe("buildMetadata", () => {
    const defaultMeta = meta({})

    it("should map title and description", () => {
        const result = buildMetadata(defaultMeta)
        expect(result.title).toBe("Шлиссельбургская ДХШ")
        expect(result.description).toBe("Сайт Шлиссельбургской художественной школы")
    })

    it("should map openGraph fields", () => {
        const result = buildMetadata(defaultMeta)
        const og = result.openGraph
        expect(og).toBeDefined()
        expect(og).toMatchObject({
            url: "https://art.shlisselburg.org/",
            title: "Шлиссельбургская ДХШ",
            description: "Сайт Шлиссельбургской художественной школы",
            siteName: "Шлиссельбургская Детская Художественная Школа",
            locale: "ru_RU",
            type: "website",
        })
    })

    it("should map openGraph images", () => {
        const result = buildMetadata(defaultMeta)
        const images = (result.openGraph as { images: unknown[] }).images
        expect(images).toHaveLength(1)
        expect(images[0]).toEqual({
            url: "https://art.shlisselburg.org/entrance.jpg",
            width: 1200,
            height: 630,
        })
    })

    it("should map twitter fields", () => {
        const result = buildMetadata(defaultMeta)
        expect(result.twitter).toEqual({
            card: "summary_large_image",
            site: "@",
            creator: "@tmshv",
        })
    })

    it("should use custom values from MetaBuilder", () => {
        const m = new MetaBuilder()
            .setTitle("Custom Page")
            .setDescription("A custom description")
            .setImage({ src: "https://example.com/cover.jpg", width: 800, height: 400 })
            .setData({ url: "/custom" })
            .build()

        const result = buildMetadata(m)
        expect(result.title).toBe("Custom Page")
        expect(result.description).toBe("A custom description")

        const og = result.openGraph as { url: string, images: { url: string, width: number, height: number }[] }
        expect(og.url).toBe("https://art.shlisselburg.org/custom")
        expect(og.images[0]).toEqual({
            url: "https://example.com/cover.jpg",
            width: 800,
            height: 400,
        })
    })
})
