"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import classnames from "classnames/bind"
import { usePathname } from "next/navigation"
import type { MenuItem } from "@/types"
import { ActiveLink } from "./ActiveLink"
import s from "./styles.module.css"

const cx = classnames.bind(s)

export type MenuProps = {
    vertical?: boolean
    items: MenuItem[]
    onItemClick?: (item: MenuItem) => void
}

export const Menu: React.FC<MenuProps> = ({ vertical = false, onItemClick, items }) => {
    const pathname = usePathname()
    return (
        <NavigationMenu.Root>
            <NavigationMenu.List className={cx(s.menu, { vertical })}>
                {items.map(item => {
                    const current = pathname === item.href
                    const href = current ? undefined : item.href
                    const className = !href ? `${s.menuItem} ${s.current}` : `${s.menuItem} ${s.active}`

                    return (
                        <NavigationMenu.Item
                            key={item.href}
                            className={className}
                            onClick={() => {
                                if (typeof onItemClick === "function") {
                                    onItemClick(item)
                                }
                            }}
                        >
                            <ActiveLink href={href}>{item.name}</ActiveLink>
                        </NavigationMenu.Item>
                    )
                })}
            </NavigationMenu.List>
        </NavigationMenu.Root>
    )
}
