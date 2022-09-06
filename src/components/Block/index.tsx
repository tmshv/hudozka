import s from "./styles.module.css"

import cx from "classnames"
import { createElement } from "react"

export type BlockProps = {
    as?: keyof HTMLElementTagNameMap
    style?: React.CSSProperties
    direction: "horizontal" | "vertical"
    children?: React.ReactNode
}

export const Block: React.FC<BlockProps> = ({ as = "div", style, direction, ...props }) => {
    const directionClass = direction === "horizontal"
        ? s.horizontal
        : s.vertical
    const newProps = {
        className: cx(s.block, directionClass),
        style,
    }

    return createElement(as, newProps, props.children)
}
