import './styles.css'

import Link from 'next/link'
import cx from 'classnames'

export type ButtonProps = {
    style?: React.CSSProperties
    href?: string
    theme?: 'default' | 'ghost'
    size?: 'default' | 'small'
}

export const Button: React.FC<ButtonProps> = ({ size='default', theme = 'default', ...props }) => {
    if (props.href) {
        return (
            <Link href={props.href}>
                <a className={cx('button', theme, size)} style={props.style}>
                    {props.children}
                </a>
            </Link>
        )
    }

    return (
        <button className={'button'} style={props.style}>
            {props.children}
        </button>
    )
}

