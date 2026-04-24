import { describe, it, expect } from "vitest"
import { insertBetween, tail } from "./array"

describe("insertBetween", () => {
    it("should return empty array for empty input", () => {
        expect(insertBetween([], () => ",")).toEqual([])
    })

    it("should return single item without separator", () => {
        expect(insertBetween(["a"], () => ",")).toEqual(["a"])
    })

    it("should insert separators between items", () => {
        expect(insertBetween(["a", "b", "c"], () => ",")).toEqual([
            "a", ",", "b", ",", "c",
        ])
    })

    it("should pass index to separator function", () => {
        const result = insertBetween(["a", "b", "c"], (i) => i)
        expect(result).toEqual(["a", 0, "b", 1, "c"])
    })
})

describe("tail", () => {
    it("should return empty array for empty input", () => {
        expect(tail([])).toEqual([])
    })

    it("should return empty array for single item", () => {
        expect(tail(["a"])).toEqual([])
    })

    it("should return all items except first", () => {
        expect(tail([1, 2, 3])).toEqual([2, 3])
    })
})
