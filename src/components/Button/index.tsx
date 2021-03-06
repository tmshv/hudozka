import s from './styles.module.css'

import Link from 'next/link'
import cx from 'classnames'
import { useCallback } from 'react'

const sizeClass = {
    default: s.sizeDefault,
    small: s.sizeSmall,
}

const themeClass = {
    default: '',
    icon: s.themeIcon,
    ghost: s.themeGhost,
}

export type ButtonProps = {
    value?: any
    style?: React.CSSProperties
    href?: string
    theme?: 'default' | 'ghost' | 'icon'
    size?: 'default' | 'small'
    disabled?: boolean
    onClick?: (value: any, event: MouseEvent) => void
}

export const Button: React.FC<ButtonProps> = ({ size = 'default', theme = 'default', disabled = false, ...props }) => {
    const className = cx(s.button, sizeClass[size], themeClass[theme], {
        [s.disabled]: disabled,
    })
    const onClick = useCallback(event => {
        if (props.onClick) {
            props.onClick(props.value, event)
        }
    }, [props.value, props.onClick])

    if (props.href) {
        return (
            <Link href={props.href}>
                <a className={className} style={props.style}>
                    {props.children}
                </a>
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
