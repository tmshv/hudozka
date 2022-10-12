import { useState } from "react"
import { ThemeContext } from "./ThemeContext"
import { ThemeType } from "./types"

export type ThemeProps = {
    children?: React.ReactNode
}

export const Theme: React.FC<ThemeProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>("default")

    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    )
}
