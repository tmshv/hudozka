import { describe, it, expect } from "vitest"
import { meta, MetaBuilder } from "./meta"

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
