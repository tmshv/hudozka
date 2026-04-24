import { describe, it, expect } from "vitest"
import { markdownToHtml, typograf } from "./text"

describe("markdownToHtml", () => {
    it("should convert markdown paragraph to HTML", () => {
        expect(markdownToHtml("hello")).toBe("<p>hello</p>\n")
    })

    it("should convert bold text", () => {
        expect(markdownToHtml("**bold**")).toBe("<p><strong>bold</strong></p>\n")
    })

    it("should pass through raw HTML", () => {
        expect(markdownToHtml("<div>test</div>")).toBe("<div>test</div>")
    })
})

describe("typograf", () => {
    it("should apply Russian typographic rules", () => {
        const result = typograf("Привет - мир")
        expect(result).toContain("Привет")
        expect(result).toContain("мир")
    })
})
