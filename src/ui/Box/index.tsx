import s from "./box.module.css"

import classnames from "classnames/bind"
import { createElement } from "react"

const cx = classnames.bind(s)

export type BoxProps = {
    as?: keyof HTMLElementTagNameMap
    children?: React.ReactNode
    style?: React.CSSProperties
    wrap?: boolean
    align?: boolean
    vertical?: boolean
    center?: boolean
}

export const Box: React.FC<BoxProps> = ({
    as = "div",
    wrap = false,
    vertical = false,
    center = false,
    align = true,
    style,
    ...props
}) => {
    const newProps = {
        className: cx(s.box, { vertical, align, center, wrap }),
        style,
    }

    return createElement(as, newProps, props.children)
}
