import { describe, it, expect, vi, beforeEach } from "vitest"
import { apiGet, getRecentPages } from "./api"

function mockFetchJson(data: unknown, ok = true) {
    return vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok,
        json: async () => data,
    } as Response)
}

beforeEach(() => {
    vi.restoreAllMocks()
})

describe("apiGet", () => {
    it("should call factory with fetched data on success", async () => {
        const data = { value: 1 }
        mockFetchJson(data)
        const factory = vi.fn((d: typeof data) => d.value)
        const result = await apiGet(factory)("https://example.com/api", () => -1)
        expect(factory).toHaveBeenCalledWith(data)
        expect(result).toBe(1)
    })

    it("should return default on non-ok response", async () => {
        mockFetchJson(null, false)
        const factory = vi.fn()
        const result = await apiGet(factory)("https://example.com/api", () => "default")
        expect(factory).not.toHaveBeenCalled()
        expect(result).toBe("default")
    })

    it("should return default and log error on network failure", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"))
        const spy = vi.spyOn(console, "error").mockImplementation(() => {})
        const factory = vi.fn()
        const result = await apiGet(factory)("https://example.com/api", () => "fallback")
        expect(factory).not.toHaveBeenCalled()
        expect(result).toBe("fallback")
        expect(spy).toHaveBeenCalled()
    })
})

describe("getRecentPages", () => {
    it("should fetch with default limit of 30", async () => {
        const spy = mockFetchJson([])
        await getRecentPages()
        expect(spy).toHaveBeenCalledWith(
            "https://hudozka.tmshv.com/pages?_sort=date:DESC&_limit=30",
        )
    })

    it("should fetch with custom limit", async () => {
        const spy = mockFetchJson([])
        await getRecentPages(10)
        expect(spy).toHaveBeenCalledWith(
            "https://hudozka.tmshv.com/pages?_sort=date:DESC&_limit=10",
        )
    })

    it("should return empty array on failure", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("fail"))
        vi.spyOn(console, "error").mockImplementation(() => {})
        const result = await getRecentPages()
        expect(result).toEqual([])
    })
})
