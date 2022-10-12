import { useLocalStorage } from "react-use"
import { ThemeContext } from "./ThemeContext"
import { ThemeType } from "./types"

export type ThemeProps = {
    children?: React.ReactNode
}

export const Theme: React.FC<ThemeProps> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage<ThemeType>("hudozka-theme", "default")

    return (
        <ThemeContext.Provider value={[theme ?? "default", setTheme]}>
            {children}
        </ThemeContext.Provider>
    )
}
