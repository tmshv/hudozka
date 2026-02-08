import { describe, it, expect } from "vitest"
import { clamp } from "./math"

describe("clamp", () => {
    it("should return value when within range", () => {
        expect(clamp(5, 0, 10)).toBe(5)
    })

    it("should return min when value is below range", () => {
        expect(clamp(-1, 0, 10)).toBe(0)
    })

    it("should return max when value is above range", () => {
        expect(clamp(15, 0, 10)).toBe(10)
    })

    it("should return min when value equals min", () => {
        expect(clamp(0, 0, 10)).toBe(0)
    })

    it("should return max when value equals max", () => {
        expect(clamp(10, 0, 10)).toBe(10)
    })

    it("should work with negative ranges", () => {
        expect(clamp(-5, -10, -1)).toBe(-5)
        expect(clamp(-15, -10, -1)).toBe(-10)
        expect(clamp(0, -10, -1)).toBe(-1)
    })
})
