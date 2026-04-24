import { useMediaQuery } from "@hudozka/hooks"

export function useDarkTheme(): boolean {
    return useMediaQuery("(prefers-color-scheme: dark)")
}
