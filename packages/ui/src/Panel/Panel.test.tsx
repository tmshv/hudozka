import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Panel } from "."

describe("Panel", () => {
    it("renders children", () => {
        const { container } = render(<Panel>hello</Panel>)
        expect(container).toHaveTextContent("hello")
    })

    it("applies the default variant class", () => {
        const { container } = render(<Panel>content</Panel>)
        const el = container.firstElementChild
        if (!el) throw new Error("expected rendered element")
        expect(el.className).toMatch(/default/)
    })

    it("applies the ghost variant class when ghost is true", () => {
        const { container } = render(<Panel ghost>content</Panel>)
        const el = container.firstElementChild
        if (!el) throw new Error("expected rendered element")
        expect(el.className).toMatch(/ghost/)
        expect(el.className).not.toMatch(/default/)
    })

    it("forwards a custom className", () => {
        const { container } = render(<Panel className="custom">content</Panel>)
        const el = container.firstElementChild
        if (!el) throw new Error("expected rendered element")
        expect(el.className).toContain("custom")
    })
})
