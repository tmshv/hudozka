import s from "./box.module.css"

import classnames from "classnames/bind"
import { createElement } from "react"

const cx = classnames.bind(s)

export type BoxProps = {
    as?: keyof HTMLElementTagNameMap
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    wrap?: boolean
    align?: boolean
    vertical?: boolean
    center?: boolean
    gap?: number | string
}

export const Box: React.FC<BoxProps> = ({
    as = "div",
    wrap = false,
    vertical = false,
    center = false,
    align = true,
    style,
    gap,
    className,
    ...props
}) => {
    const newProps = {
        className: cx(className, s.box, { vertical, align, center, wrap }),
        style: {
            ...style,
            gap,
        },
    }

    return createElement(as, newProps, props.children)
}
