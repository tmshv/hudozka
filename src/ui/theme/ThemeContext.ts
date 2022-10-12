import { createContext } from "react"
import { SetTheme, ThemeType } from "./types"

export const ThemeContext = createContext<[ThemeType, SetTheme]>(["default", () => {}])
