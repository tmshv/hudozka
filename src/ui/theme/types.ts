export type ThemeOptions = {
    theme: "default" | "contrast"
    fontSize?: number
}
export type SetTheme = (theme: ThemeOptions["theme"]) => void
