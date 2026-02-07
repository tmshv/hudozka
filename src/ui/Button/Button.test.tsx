import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Button } from "."

describe("Button", () => {
    it("renders children in a button element", () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole("button", { name: "Click me" })
        expect(button).toBeInTheDocument()
        expect(button.tagName).toBe("BUTTON")
    })

    it("renders as a link when href is provided", () => {
        render(<Button href="/about">About</Button>)
        const link = screen.getByRole("link", { name: "About" })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("href", "/about")
    })

    it("calls onClick with value when clicked", () => {
        const onClick = vi.fn()
        render(<Button value="test-value" onClick={onClick}>Click</Button>)
        fireEvent.click(screen.getByRole("button", { name: "Click" }))
        expect(onClick).toHaveBeenCalledOnce()
        expect(onClick).toHaveBeenCalledWith("test-value", expect.anything())
    })

    it("applies disabled class when disabled is true", () => {
        const { container } = render(<Button disabled>Disabled</Button>)
        expect(container.firstElementChild!.className).toMatch(/disabled/)
    })
})
