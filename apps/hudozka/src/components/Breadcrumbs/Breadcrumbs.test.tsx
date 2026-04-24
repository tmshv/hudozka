import { render, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Breadcrumbs } from "."

describe("Breadcrumbs", () => {
    const items = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Team", href: "/about/team" },
    ]

    it("renders breadcrumb items with separators", () => {
        const { container } = render(<Breadcrumbs items={items} path="/about/team" />)
        const nav = within(container.querySelector("nav")!)

        expect(nav.getByText("Home")).toBeInTheDocument()
        expect(nav.getByText("About")).toBeInTheDocument()
        expect(nav.getByText("Team")).toBeInTheDocument()

        const separators = nav.getAllByText("/")
        expect(separators).toHaveLength(2)
    })

    it("disables the button matching the current path", () => {
        const { container } = render(<Breadcrumbs items={items} path="/about" />)
        const nav = within(container.querySelector("nav")!)

        const aboutLink = nav.getByText("About").closest("a")!
        expect(aboutLink.className).toMatch(/disabled/)

        const homeLink = nav.getByText("Home").closest("a")!
        expect(homeLink.className).not.toMatch(/disabled/)
    })
})
