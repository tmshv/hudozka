import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { useMediaQuery } from "./useMediaQuery"

describe("useMediaQuery", () => {
    let listeners: Map<string, Set<() => void>>
    let matches: Map<string, boolean>

    beforeEach(() => {
        listeners = new Map()
        matches = new Map()

        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: matches.get(query) ?? false,
            addEventListener: (_: string, cb: () => void) => {
                if (!listeners.has(query)) {
                    listeners.set(query, new Set())
                }
                listeners.get(query)!.add(cb)
            },
            removeEventListener: (_: string, cb: () => void) => {
                listeners.get(query)?.delete(cb)
            },
        }))
    })

    it("returns current match state", () => {
        matches.set("(min-width: 800px)", true)
        const { result } = renderHook(() => useMediaQuery("(min-width: 800px)"))
        expect(result.current).toBe(true)
    })

    it("returns false when query does not match", () => {
        const { result } = renderHook(() => useMediaQuery("(min-width: 800px)"))
        expect(result.current).toBe(false)
    })

    it("updates on change events", () => {
        const query = "(min-width: 800px)"
        const { result } = renderHook(() => useMediaQuery(query))
        expect(result.current).toBe(false)

        act(() => {
            matches.set(query, true)
            listeners.get(query)?.forEach((cb) => cb())
        })
        expect(result.current).toBe(true)
    })

    it("cleans up listener on unmount", () => {
        const query = "(min-width: 800px)"
        const { unmount } = renderHook(() => useMediaQuery(query))
        expect(listeners.get(query)?.size).toBe(1)
        unmount()
        expect(listeners.get(query)?.size).toBe(0)
    })
})
