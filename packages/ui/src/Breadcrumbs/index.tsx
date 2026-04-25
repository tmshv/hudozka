import s from "./styles.module.css"

import { Button } from "../Button"
import { insertBetween } from "@hudozka/utils"

export type Crumb = {
    name: string
    href: string
}

export type BreadcrumbsProps = {
    style?: React.CSSProperties
    items: Crumb[]
    path: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = props => {
    const items = insertBetween(props.items, () => "/")

    return (
        <nav className={s.breadcrumbs} style={props.style}>
            {items.map((x, i) => {
                if (typeof x === "string") {
                    return (
                        <li key={i}>
                            <span style={{ margin: "0 var(--size-xs)" }}>{x}</span>
                        </li>
                    )
                }

                return (
                    <li key={x.href}>
                        <Button
                            href={x.href}
                            theme={"ghost"}
                            size={"small"}
                            disabled={x.href === props.path}
                        >
                            {x.name}
                        </Button>
                    </li>
                )
            })}
        </nav>
    )
}
