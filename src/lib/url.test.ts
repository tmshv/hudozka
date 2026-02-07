import { describe, it, expect } from "vitest"
import { queryList } from "./url"

describe("queryList", () => {
    it("should return empty string for empty values", () => {
        expect(queryList("tag", [])).toBe("")
    })

    it("should return single key=value pair", () => {
        expect(queryList("tag", ["art"])).toBe("tag=art")
    })

    it("should join multiple values with &", () => {
        expect(queryList("tag", ["art", "music", "photo"])).toBe(
            "tag=art&tag=music&tag=photo",
        )
    })
})
