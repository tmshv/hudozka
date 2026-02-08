import { useMediaQuery } from "@/hooks/useMediaQuery"

export function useDarkTheme(): boolean {
    return useMediaQuery("(prefers-color-scheme: dark)")
}
