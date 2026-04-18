import type { MenuItem } from "./types"

export const yearRange = [2012, 2026].join("—")
export const siteUrl = "https://art.shlisselburg.org"

export const menu: MenuItem[] = [
    {
        name: "Школа",
        href: "/",
    },
    {
        name: "Коллектив",
        href: "/collective",
    },
    {
        name: "Документы",
        href: "/documents",
    },
    {
        name: "Сведения об образовательной организации",
        href: "/info",
    },
]
