import s from "./button.module.css"

import Link from "next/link"
import cx from "classnames"
import { useCallback } from "react"
import type { MouseEvent, MouseEventHandler } from "react"

const sizeClass = {
    default: s.sizeDefault,
    small: s.sizeSmall,
}

const themeClass = {
    default: "",
    icon: s.themeIcon,
    ghost: s.themeGhost,
}

export type ButtonProps = {
    children?: React.ReactNode
    value?: string
    style?: React.CSSProperties
    href?: string
    theme?: "default" | "ghost" | "icon"
    size?: "default" | "small"
    disabled?: boolean
    onClick?: (value: string | undefined, event: MouseEvent) => void
}

export const Button: React.FC<ButtonProps> = ({ size = "default", theme = "default", disabled = false, ...props }) => {
    const className = cx(s.button, sizeClass[size], themeClass[theme], {
        [s.disabled]: disabled,
    })
    const onClick = useCallback<MouseEventHandler<HTMLButtonElement>>(event => {
        if (typeof props.onClick === "function") {
            props.onClick(props.value, event)
        }
    }, [props])

    if (props.href) {
        return (
            <Link href={props.href} className={className} style={props.style}>
                {props.children}
            </Link>
        )
    }

    return (
        <button
            className={className}
            style={props.style}
            onClick={onClick}
        >
            {props.children}
        </button>
    )
}
