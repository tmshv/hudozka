import { render, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Pagination } from "."

function getNav(container: HTMLElement) {
    const nav = container.querySelector("nav")
    if (!nav) throw new Error("expected <nav>")
    return within(nav)
}

describe("Pagination", () => {
    it("renders nothing when total fits one page", () => {
        const { container } = render(<Pagination basePath="/tags/watercolor" page={1} total={10} perPage={24} />)
        expect(container.querySelector("nav")).toBeNull()
    })

    it("renders prev/next and page links when there are multiple pages", () => {
        const { container } = render(<Pagination basePath="/tags/watercolor" page={2} total={72} perPage={24} />)
        const nav = getNav(container)

        const prev = nav.getByText("← Назад").closest("a")
        const next = nav.getByText("Вперёд →").closest("a")
        expect(prev).toHaveAttribute("href", "/tags/watercolor")
        expect(next).toHaveAttribute("href", "/tags/watercolor?page=3")
    })

    it("disables prev on the first page and next on the last page", () => {
        const first = render(<Pagination basePath="/tags/x" page={1} total={50} perPage={24} />)
        const navFirst = getNav(first.container)
        expect(navFirst.getByText("← Назад").tagName).toBe("SPAN")

        const last = render(<Pagination basePath="/tags/x" page={3} total={50} perPage={24} />)
        const navLast = getNav(last.container)
        expect(navLast.getByText("Вперёд →").tagName).toBe("SPAN")
    })

    it("marks the current page with aria-current and renders it as a span", () => {
        const { container } = render(<Pagination basePath="/tags/x" page={2} total={72} perPage={24} />)
        const nav = getNav(container)
        const current = nav.getByText("2")
        expect(current.tagName).toBe("SPAN")
        expect(current).toHaveAttribute("aria-current", "page")
    })

    it("shows an ellipsis when there are more than 7 pages", () => {
        const { container } = render(<Pagination basePath="/tags/x" page={5} total={24 * 10} perPage={24} />)
        const nav = getNav(container)
        expect(nav.getAllByText("…").length).toBeGreaterThan(0)
        expect(nav.getByText("1")).toBeInTheDocument()
        expect(nav.getByText("10")).toBeInTheDocument()
    })
})
