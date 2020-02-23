import Link from 'next/link'

export interface ActiveLinkProps {
    href?: string
    activeStyle?: React.CSSProperties
}

export const ActiveLink: React.FC<ActiveLinkProps> = props => props.href
    ? (
        <Link href={props.href}>
            <a>{props.children}</a>
        </Link>
    ) : (
        <span style={props.activeStyle}>{props.children}</span>
    )