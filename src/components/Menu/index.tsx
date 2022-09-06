import s from "./styles.module.css"

import cx from "classnames"
import { MenuItem } from "./MenuItem"
import { IMenu } from "src/types"

const layoutClass = {
    desktop: s.desktop,
    mobile: s.mobile,
}

export type MenuProps = {
    layout: "desktop" | "mobile"
    items: IMenu[]
}

export const Menu: React.FC<MenuProps> = props => (
    <menu className={cx(s.menu, layoutClass[props.layout])}>
        {props.items.map((item, index) => (
            <MenuItem key={index}
                href={item.href}
            >
                {item.name}
            </MenuItem>
        ))}
    </menu>
)
