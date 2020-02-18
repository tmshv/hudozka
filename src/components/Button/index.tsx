import './styles.css'
import Link from 'next/link'

export type ButtonProps = {
    style?: React.CSSProperties
    href?: string
}

export const Button: React.FC<ButtonProps> = props => {
    if (props.href) {
        return (
            <Link href={props.href}>
                <a className={'button invisible'} style={props.style}>
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