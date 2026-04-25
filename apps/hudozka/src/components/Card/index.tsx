import cx from "classnames"
import Link from "next/link"
import s from "./styles.module.css"

export type CardLayout = "simple" | "featured"
export type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    href: string
    cover: React.ReactNode
    layout: CardLayout
}

export function Card(props: CardProps) {
    return (
        <Link href={props.href} className={cx(s.card, s.simple)} style={props.style}>
            <div className={s.image}>{props.cover}</div>

            <div className={s.body}>{props.children}</div>
        </Link>
    )
}
