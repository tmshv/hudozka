import useMedia from "use-media"

export function useDarkTheme(): boolean {
    return useMedia("(prefers-color-scheme: dark)")
}
