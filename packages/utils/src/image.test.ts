import { describe, it, expect } from "vitest"
import { getResizedUrl } from "./image"

describe("getResizedUrl", () => {
    it("should construct resize URL with default n", () => {
        const result = getResizedUrl("example.com/img.jpg", {
            width: 800,
            height: 600,
        })
        expect(result).toBe(
            "https://images.weserv.nl/?url=example.com/img.jpg&w=800&h=600&n=1",
        )
    })

    it("should use custom n parameter", () => {
        const result = getResizedUrl("example.com/img.jpg", {
            width: 400,
            height: 300,
            n: -1,
        })
        expect(result).toBe(
            "https://images.weserv.nl/?url=example.com/img.jpg&w=400&h=300&n=-1",
        )
    })
})
