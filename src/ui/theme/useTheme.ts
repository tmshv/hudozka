import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { SetTheme, ThemeType } from "./types"

export type UseThemeResult = {
    theme: ThemeType
    setTheme: SetTheme
    // toggleTheme:
}

export function useTheme(): UseThemeResult {
    const [theme, setTheme] = useContext(ThemeContext)

    return { theme, setTheme }
}
