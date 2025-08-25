import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { SetTheme, ThemeOptions } from "./types"

export type UseThemeResult = {
    theme: ThemeOptions["theme"]
    setTheme: SetTheme
    // toggleTheme:
}

export function useTheme(): UseThemeResult {
    const [theme, setTheme] = useContext(ThemeContext)

    return {
        setTheme,
        theme: theme.theme ?? "default",
    }
}
