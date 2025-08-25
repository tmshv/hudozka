import { createContext } from "react"
import { DEFAULT } from "./const"
import { SetTheme, ThemeOptions } from "./types"

export const ThemeContext = createContext<[ThemeOptions, SetTheme]>([DEFAULT, () => {}])
