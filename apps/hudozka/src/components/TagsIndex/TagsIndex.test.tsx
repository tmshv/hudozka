import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Tag } from "@/types"
import { TagsIndex } from "."

const tags: Tag[] = [
    { id: "1", name: "Акварель", slug: "watercolor", href: "/tags/watercolor", count: 12 },
    { id: "2", name: "Графика", slug: "graphics", href: "/tags/graphics", count: 5 },
]

describe("TagsIndex", () => {
    it("renders each tag with label and count", () => {
        const { getByText } = render(<TagsIndex items={tags} />)
        expect(getByText(/Акварель/)).toBeInTheDocument()
        expect(getByText(/12/)).toBeInTheDocument()
        expect(getByText(/Графика/)).toBeInTheDocument()
        expect(getByText(/5/)).toBeInTheDocument()
    })

    it("links each tag to its href", () => {
        const { container } = render(<TagsIndex items={tags} />)
        const links = container.querySelectorAll("a")
        expect(links[0]).toHaveAttribute("href", "/tags/watercolor")
        expect(links[1]).toHaveAttribute("href", "/tags/graphics")
    })

    it("preserves input order", () => {
        const reversed = [...tags].reverse()
        const { container } = render(<TagsIndex items={reversed} />)
        const links = container.querySelectorAll("a")
        expect(links[0]).toHaveAttribute("href", "/tags/graphics")
        expect(links[1]).toHaveAttribute("href", "/tags/watercolor")
    })
})
