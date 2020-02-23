import './styles.css'

import Link from 'next/link'
import cx from 'classnames'

export type ButtonProps = {
    style?: React.CSSProperties
    href?: string
    theme?: 'default' | 'ghost'
    size?: 'default' | 'small'
    disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ size = 'default', theme = 'default', disabled = false, ...props }) => {
    const className = cx('button', theme, size, {
        disabled
    })

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
        <button className={className} style={props.style}>
            {props.children}
        </button>
    )
}
