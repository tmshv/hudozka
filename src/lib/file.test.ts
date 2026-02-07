import { describe, it, expect } from "vitest"
import { ext, size } from "./file"

describe("ext", () => {
    it("should return ПДФ for application/pdf", () => {
        expect(ext("application/pdf")).toBe("ПДФ")
    })

    it("should return ЖПГ for image/jpeg", () => {
        expect(ext("image/jpeg")).toBe("ЖПГ")
    })

    it("should return ПНГ for image/png", () => {
        expect(ext("image/png")).toBe("ПНГ")
    })

    it("should return raw MIME type for unknown types", () => {
        expect(ext("text/plain")).toBe("text/plain")
    })
})

describe("size", () => {
    it("should return empty string for NaN", () => {
        expect(size(NaN)).toBe("")
    })

    it("should return empty string for non-finite values", () => {
        expect(size(Infinity)).toBe("")
    })

    it("should format bytes", () => {
        expect(size(500)).toBe("500.0 байт")
    })

    it("should format kilobytes", () => {
        expect(size(1024)).toBe("1.0 КБ")
    })

    it("should format megabytes", () => {
        expect(size(1024 * 1024)).toBe("1.0 МБ")
    })

    it("should format gigabytes", () => {
        expect(size(1024 * 1024 * 1024)).toBe("1.0 ГБ")
    })

    it("should respect precision parameter", () => {
        expect(size(1536, 2)).toBe("1.50 КБ")
    })
})
