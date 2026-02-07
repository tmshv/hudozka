import { describe, it, expect } from "vitest"
import { script } from "./YMetrika"

describe("YMetrika script", () => {
    it("should embed account id into metrika counter variable", () => {
        const result = script(99999)
        expect(result).toContain("w.yaCounter99999")
    })

    it("should embed account id into metrika config", () => {
        const result = script(99999)
        expect(result).toContain("id:99999")
    })

    it("should include metrika watch.js script url", () => {
        const result = script(99999)
        expect(result).toContain("https://mc.yandex.ru/metrika/watch.js")
    })

    it("should use yandex_metrika_callbacks", () => {
        const result = script(99999)
        expect(result).toContain("yandex_metrika_callbacks")
    })

    it("should produce different output for different accounts", () => {
        const a = script(11111)
        const b = script(22222)
        expect(a).toContain("yaCounter11111")
        expect(b).toContain("yaCounter22222")
        expect(a).not.toContain("yaCounter22222")
    })
})
