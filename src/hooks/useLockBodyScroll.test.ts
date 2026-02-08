import { renderHook } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { useLockBodyScroll } from "./useLockBodyScroll"

describe("useLockBodyScroll", () => {
    beforeEach(() => {
        document.body.style.overflow = ""
    })

    it("sets overflow hidden when locked", () => {
        renderHook(() => useLockBodyScroll(true))
        expect(document.body.style.overflow).toBe("hidden")
    })

    it("does not change overflow when unlocked", () => {
        document.body.style.overflow = "auto"
        renderHook(() => useLockBodyScroll(false))
        expect(document.body.style.overflow).toBe("auto")
    })

    it("restores original overflow on unmount", () => {
        document.body.style.overflow = "scroll"
        const { unmount } = renderHook(() => useLockBodyScroll(true))
        expect(document.body.style.overflow).toBe("hidden")
        unmount()
        expect(document.body.style.overflow).toBe("scroll")
    })

    it("responds to lock/unlock transitions", () => {
        const { rerender } = renderHook(
            ({ locked }) => useLockBodyScroll(locked),
            { initialProps: { locked: false } },
        )
        expect(document.body.style.overflow).toBe("")
        rerender({ locked: true })
        expect(document.body.style.overflow).toBe("hidden")
        rerender({ locked: false })
        expect(document.body.style.overflow).toBe("")
    })
})
