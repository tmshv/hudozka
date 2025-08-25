import { proxy, subscribe, useSnapshot } from "valtio"

export type ThemeName = "default" | "contrast"
export type ColorSchemeVariant = "black-on-white" | "white-on-black" | "blue-on-blue" | "brown-on-yellow" | "green-on-brown"

const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 48
const CHANGE_FONT_SIZE_DELTA = 0.2

function clamp(val: number, min: number, max: number): number {
    if (val < min) {
        return min
    }
    if (val > max) {
        return max
    }
    return val
}

export type ThemeOptions = {
    theme: ThemeName
    fontType: string
    fontSize: number
    lineHeight: number
    letterSpacing: number
    showImages: boolean
    colorScheme: ColorSchemeVariant
}

export const theme = proxy<ThemeOptions>({
    theme: "default",
    fontSize: 14,
    lineHeight: 1.5,
    letterSpacing: 1,
    fontType: "Times New Roman",
    showImages: true,
    colorScheme: "black-on-white",
})

export function reset() {
    theme.fontSize = 14
    theme.lineHeight = 1.5
    theme.letterSpacing = 1
    theme.fontType = "Times New Roman"
    theme.showImages = true
    theme.colorScheme = "black-on-white"
}

export function setDefaultTheme() {
    theme.theme = "default"
    reset()
}

export function toggleTheme() {
    theme.theme = theme.theme === "default" ? "contrast" : "default"
}

export function increaseFontSize() {
    theme.fontSize = clamp(theme.fontSize + CHANGE_FONT_SIZE_DELTA, MIN_FONT_SIZE, MAX_FONT_SIZE)
}

export function decreaseFontSize() {
    theme.fontSize = clamp(theme.fontSize - CHANGE_FONT_SIZE_DELTA, MIN_FONT_SIZE, MAX_FONT_SIZE)
}

export function setSerifFont() {
    theme.fontType = "sans-serif"
}

export function setSansFont() {
    theme.fontType = "Times New Roman"
}

export function showImages() {
    theme.showImages = true
}

export function hideImages() {
    theme.showImages = false
}

export function setBlackOnWhite() {
    theme.colorScheme = "black-on-white"
}

export function setWhiteOnBlack() {
    theme.colorScheme = "white-on-black"
}

export function setBlueOnBlue() {
    theme.colorScheme = "blue-on-blue"
}

export function setBrownOnYellow() {
    theme.colorScheme = "brown-on-yellow"
}

export function setGreenOnBrown() {
    theme.colorScheme = "green-on-brown"
}

export function setLineHeightOneAndHalf() {
    theme.lineHeight = 1.5
}

export function setLineHeightTwo() {
    theme.lineHeight = 2
}

export function setLineHeightTwoAndHalf() {
    theme.lineHeight = 2.5
}

export function setLetterSpacingOne() {
    theme.letterSpacing = 1
}

export function setLetterSpacingTwo() {
    theme.letterSpacing = 2
}

export function setLetterSpacingFour() {
    theme.letterSpacing = 4
}

function getColor(scheme: ColorSchemeVariant): [string, string] {
    switch (theme.colorScheme) {
    case "black-on-white":
        return ["black", "white"]
    case "white-on-black":
        return ["white", "black"]
    case "blue-on-blue":
        return ["oklch(32% 24% 253deg)", "oklch(84% 21% 245deg)"]
    case "brown-on-yellow":
        return ["oklch(41% 3% 92deg)", "oklch(96% 9% 101deg)"]
    case "green-on-brown":
        return ["oklch(85% 47% 128deg)", "oklch(29% 10% 61deg)"]
    default:
        return ["black", "white"]
    }
}

const unsubscribe = subscribe(theme, () => {
    document.documentElement.style.setProperty("--font-size-default", `${theme.fontSize}pt`)

    document.documentElement.style.setProperty("--title-font", theme.fontType)
    document.documentElement.style.setProperty("--text-font", theme.fontType)

    document.documentElement.style.setProperty("--article-line-height", `${theme.lineHeight}em`)
    if (theme.letterSpacing === 1) {
        document.documentElement.style.setProperty("--letter-spacing", "normal")
    } else {
        document.documentElement.style.setProperty("--letter-spacing", `${theme.letterSpacing}px`)
    }

    const [t, b] = getColor(theme.colorScheme)
    document.documentElement.style.setProperty("--color-text", t)
    document.documentElement.style.setProperty("--color-text-second", t)
    document.documentElement.style.setProperty("--color-text-opposite", b)
    document.documentElement.style.setProperty("--color-back-main", b)
    document.documentElement.style.setProperty("--color-back", b)
})
