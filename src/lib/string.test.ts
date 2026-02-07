import { describe, it, expect } from "vitest"
import { titleCase } from "./string"

describe("titleCase", () => {
    it("should capitalize first letter of lowercase string", () => {
        expect(titleCase("hello")).toBe("Hello")
    })

    it("should keep already capitalized string", () => {
        expect(titleCase("Hello")).toBe("Hello")
    })

    it("should handle empty string", () => {
        expect(titleCase("")).toBe("")
    })

    it("should capitalize single character", () => {
        expect(titleCase("a")).toBe("A")
    })
})
