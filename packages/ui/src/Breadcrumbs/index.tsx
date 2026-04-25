import { Fragment } from "react"
import { Button } from "../Button"
import s from "./styles.module.css"

export type Crumb = {
    name: string
    href: string
}

export type BreadcrumbsProps = {
    style?: React.CSSProperties
    items: Crumb[]
    path: string
}

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <nav className={s.breadcrumbs} style={props.style}>
            {props.items.map((x, i) => (
                <Fragment key={x.href}>
                    {i > 0 && (
                        <li>
                            <span style={{ margin: "0 var(--size-xs)" }}>/</span>
                        </li>
                    )}
                    <li>
                        <Button href={x.href} theme={"ghost"} size={"small"} disabled={x.href === props.path}>
                            {x.name}
                        </Button>
                    </li>
                </Fragment>
            ))}
        </nav>
    )
}
