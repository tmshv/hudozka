import { describe, it, expect } from "vitest"
import { dateFormat } from "./date"

describe("dateFormat", () => {
    it("should format a Date object in Russian locale", () => {
        const result = dateFormat(new Date(2024, 0, 15))
        expect(result).toBe("15 января 2024")
    })

    it("should format a date string in Russian locale", () => {
        const result = dateFormat("2024-06-01T00:00:00.000Z")
        expect(result).toBe("1 июня 2024")
    })
})
