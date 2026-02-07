import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Box } from "."

describe("Box", () => {
    it("renders children", () => {
        render(<Box>hello</Box>)
        expect(screen.getByText("hello")).toBeInTheDocument()
    })

    it("defaults to a div tag", () => {
        render(<Box>content</Box>)
        expect(screen.getByText("content").tagName).toBe("DIV")
    })

    it("renders as a custom tag via the as prop", () => {
        render(<Box as="section">section content</Box>)
        expect(screen.getByText("section content").tagName).toBe("SECTION")
    })

    it("applies vertical class", () => {
        const { container } = render(<Box vertical>v</Box>)
        const el = container.firstElementChild!
        expect(el.className).toMatch(/vertical/)
    })

    it("applies center class", () => {
        const { container } = render(<Box center>c</Box>)
        const el = container.firstElementChild!
        expect(el.className).toMatch(/center/)
    })

    it("applies wrap class", () => {
        const { container } = render(<Box wrap>w</Box>)
        const el = container.firstElementChild!
        expect(el.className).toMatch(/wrap/)
    })

    it("passes gap to inline style", () => {
        const { container } = render(<Box gap={8}>g</Box>)
        const el = container.firstElementChild!
        expect(el).toHaveStyle({ gap: "8px" })
    })
})
