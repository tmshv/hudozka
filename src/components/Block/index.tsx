import s from "./styles.module.css"

import classnames from "classnames/bind"
import { createElement } from "react"

const cx = classnames.bind(s)

export type BlockProps = {
    as?: keyof HTMLElementTagNameMap
    style?: React.CSSProperties
    direction: "horizontal" | "vertical"
    children?: React.ReactNode
    align?: boolean
}

export const Block: React.FC<BlockProps> = ({ as = "div", align = false, style, direction, ...props }) => {
    const directionClass = direction === "horizontal"
        ? s.horizontal
        : s.vertical
    const newProps = {
        className: cx(s.block, directionClass, { align }),
        style,
    }

    return createElement(as, newProps, props.children)
}
