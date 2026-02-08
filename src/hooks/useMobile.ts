import { useMediaQuery } from "@/hooks/useMediaQuery"

export function useMobile(): boolean {
    return useMediaQuery("(max-width: 31.25em)", false)
}
