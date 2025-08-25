import { createContext } from "react"

export const menu = [
    {
        name: "Школа",
        href: "/",
    },
]

export const MenuContext = createContext(menu)
