import Link from "next/link"

export type ActiveLinkProps = {
    href?: string
    activeStyle?: React.CSSProperties
    children?: React.ReactNode
}

export const ActiveLink: React.FC<ActiveLinkProps> = props => props.href
    ? (
        <Link href={props.href}>
            {props.children}
        </Link>
    ) : (
        <span style={props.activeStyle}>{props.children}</span>
    )
