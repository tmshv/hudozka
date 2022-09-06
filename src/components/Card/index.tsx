import s from "./styles.module.css"

import cx from "classnames"
import Link from "next/link"

const layoutClass = {
    simple: s.simple,
    featured: s.featured,
}

export type CardLayout = "simple" | "featured"
export type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    href: string
    cover: React.ReactNode
    layout: CardLayout
}

export const Card: React.FC<CardProps> = props => (
    <div className={cx(s.card, layoutClass[props.layout])} style={props.style}>
        <Link href={props.href}>
            <a>
                <div className={s.image}>
                    {props.cover}
                </div>

                <div className={s.body}>
                    {props.children}
                </div>
            </a>
        </Link>
    </div>
)
