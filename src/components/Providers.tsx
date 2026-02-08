"use client"

import { MenuContext } from "@/context/MenuContext"
import type { MenuItem } from "@/types"

export type ProvidersProps = {
    menu: MenuItem[]
    children: React.ReactNode
}

export function Providers({ menu, children }: ProvidersProps) {
    return (
        <MenuContext.Provider value={menu}>
            {children}
        </MenuContext.Provider>
    )
}
