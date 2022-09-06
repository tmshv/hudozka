import s from "./styles.module.css"

import { IMenu } from "@/types"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import classnames from "classnames/bind"
import { useRouter } from "next/router"
import { ActiveLink } from "./ActiveLink"

let cx = classnames.bind(s)

export type MenuProps = {
    vertical?: boolean
    items: IMenu[]
}

export const Menu: React.FC<MenuProps> = ({ vertical = false, items }) => {
    const router = useRouter()
    return (
        <NavigationMenu.Root>
            <NavigationMenu.List className={cx(s.menu, { vertical })}>
                {
                    items.map(item => {
                        const current = router.asPath === item.href
                        const href = current ? undefined : item.href

                        if (!href) {
                            return (
                                <NavigationMenu.Item key={item.href} className={`${s.menuItem} ${s.current}`}>
                                    <ActiveLink>{item.name}</ActiveLink>
                                </NavigationMenu.Item>
                            )
                        }
                        return (
                            <NavigationMenu.Item key={item.href} className={`${s.menuItem} ${s.active}`}>
                                <ActiveLink href={item.href}>{item.name}</ActiveLink>
                            </NavigationMenu.Item>
                        )
                    })
                }
            </NavigationMenu.List>
        </NavigationMenu.Root>
    )
}
