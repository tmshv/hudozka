import { proxy, subscribe } from "valtio"
import { clamp } from "@/lib/math"

export type ThemeName = "default" | "contrast"
export type ColorSchemeVariant = "black-on-white" | "white-on-black" | "blue-on-blue" | "brown-on-yellow" | "green-on-brown"
export type FontTypeVariant = "serif" | "sans-serif"

const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 48
const CHANGE_FONT_SIZE_DELTA = 1

export type ThemeOptions = {
    theme: ThemeName
    fontType: FontTypeVariant
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
    fontType: "sans-serif",
    showImages: true,
    colorScheme: "black-on-white",
})

export function reset() {
    theme.fontSize = 14
    theme.lineHeight = 1.5
    theme.letterSpacing = 1
    theme.fontType = "sans-serif"
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

export function setSansSerifFont() {
    theme.fontType = "sans-serif"
}

export function setSerifFont() {
    theme.fontType = "serif"
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

const unsubscribe = subscribe(theme, () => {
    document.documentElement.style.setProperty("--font-size-default", `${theme.fontSize}pt`)
    document.documentElement.style.setProperty("--font-size-second", `${theme.fontSize}pt`)
    document.documentElement.style.setProperty("--font-size-accent", `${theme.fontSize}pt`)
    document.documentElement.style.setProperty("--article-line-height", `${theme.lineHeight}em`)
    if (theme.letterSpacing === 1) {
        document.documentElement.style.setProperty("--letter-spacing", "normal")
    } else {
        document.documentElement.style.setProperty("--letter-spacing", `${theme.letterSpacing}px`)
    }

    // TODO remove this from here and move this logic directly to body tag after moving from pages to app
    document.body.classList.forEach(name => {
        document.body.classList.remove(name)
    })
    if (theme.theme === "contrast") {
        document.body.classList.add("theme-contrast")
        document.body.classList.add(theme.colorScheme)
    }
})
