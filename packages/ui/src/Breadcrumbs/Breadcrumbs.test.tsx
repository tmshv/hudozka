import { render, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Breadcrumbs } from "."

describe("Breadcrumbs", () => {
    const items = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Team", href: "/about/team" },
    ]

    function getNav(container: HTMLElement) {
        const navEl = container.querySelector("nav")
        if (!navEl) throw new Error("expected <nav> element to be rendered")
        return within(navEl)
    }

    function getClosestLink(el: HTMLElement) {
        const link = el.closest("a")
        if (!link) throw new Error("expected ancestor <a> element")
        return link
    }

    it("renders breadcrumb items with separators", () => {
        const { container } = render(<Breadcrumbs items={items} path="/about/team" />)
        const nav = getNav(container)

        expect(nav.getByText("Home")).toBeInTheDocument()
        expect(nav.getByText("About")).toBeInTheDocument()
        expect(nav.getByText("Team")).toBeInTheDocument()

        const separators = nav.getAllByText("/")
        expect(separators).toHaveLength(2)
    })

    it("disables the button matching the current path", () => {
        const { container } = render(<Breadcrumbs items={items} path="/about" />)
        const nav = getNav(container)

        const aboutLink = getClosestLink(nav.getByText("About"))
        expect(aboutLink.className).toMatch(/disabled/)

        const homeLink = getClosestLink(nav.getByText("Home"))
        expect(homeLink.className).not.toMatch(/disabled/)
    })
})
