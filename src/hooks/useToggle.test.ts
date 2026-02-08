import { renderHook, act } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useToggle } from "./useToggle"

describe("useToggle", () => {
    it("returns initial value", () => {
        const { result } = renderHook(() => useToggle(false))
        expect(result.current[0]).toBe(false)
    })

    it("toggles value", () => {
        const { result } = renderHook(() => useToggle(false))
        act(() => result.current[1]())
        expect(result.current[0]).toBe(true)
        act(() => result.current[1]())
        expect(result.current[0]).toBe(false)
    })

    it("sets explicit true", () => {
        const { result } = renderHook(() => useToggle(false))
        act(() => result.current[1](true))
        expect(result.current[0]).toBe(true)
    })

    it("sets explicit false", () => {
        const { result } = renderHook(() => useToggle(true))
        act(() => result.current[1](false))
        expect(result.current[0]).toBe(false)
    })

    it("has a stable dispatch reference", () => {
        const { result, rerender } = renderHook(() => useToggle(false))
        const first = result.current[1]
        rerender()
        expect(result.current[1]).toBe(first)
    })
})
