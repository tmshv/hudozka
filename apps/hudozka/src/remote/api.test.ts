import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("./pb", () => ({
    pb: {
        baseURL: "http://127.0.0.1:8090",
        collection: vi.fn(),
    },
}))

import { getUrls, getRecentPages } from "./api"
import { pb } from "./pb"

beforeEach(() => {
    vi.restoreAllMocks()
})

describe("getUrls", () => {
    it("should return slugs from all non-draft pages", async () => {
        const mockGetFullList = vi.fn().mockResolvedValue([
            { slug: "/info" },
            { slug: "/2024/test" },
        ])
        vi.mocked(pb.collection).mockReturnValue({
            getFullList: mockGetFullList,
        } as never)

        const result = await getUrls()
        expect(result).toEqual(["/info", "/2024/test"])
        expect(pb.collection).toHaveBeenCalledWith("pages")
        expect(mockGetFullList).toHaveBeenCalledWith({
            fields: "slug",
            filter: "draft=false",
        })
    })

    it("should return empty array on error", async () => {
        vi.mocked(pb.collection).mockReturnValue({
            getFullList: vi.fn().mockRejectedValue(new Error("fail")),
        } as never)
        vi.spyOn(console, "error").mockImplementation(() => {})

        const result = await getUrls()
        expect(result).toEqual([])
    })
})

describe("getRecentPages", () => {
    it("should fetch recent pages with default limit", async () => {
        const mockGetList = vi.fn().mockResolvedValue({
            items: [
                {
                    id: "x1",
                    title: "Recent",
                    slug: "/2024/recent",
                    date: "2024-03-01",
                    excerpt: "Summary",
                    doc: { version: 1, blocks: [] },
                    tags: [],
                    draft: false,
                },
            ],
        })
        vi.mocked(pb.collection).mockReturnValue({
            getList: mockGetList,
        } as never)

        const result = await getRecentPages()
        expect(result).toEqual([{
            id: "x1",
            title: "Recent",
            url: "/2024/recent",
            date: "2024-03-01",
            excerpt: "Summary",
        }])
        expect(mockGetList).toHaveBeenCalledWith(1, 30, {
            filter: "date!='' && draft=false",
            sort: "-date",
        })
    })

    it("should return empty array on error", async () => {
        vi.mocked(pb.collection).mockReturnValue({
            getList: vi.fn().mockRejectedValue(new Error("fail")),
        } as never)
        vi.spyOn(console, "error").mockImplementation(() => {})

        const result = await getRecentPages()
        expect(result).toEqual([])
    })
})
