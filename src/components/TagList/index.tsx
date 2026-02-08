import s from "./styles.module.css"

import cx from "classnames"
import { Tag } from "src/types"
import { Button } from "@/ui/Button"

const directionClass = {
    horizontal: "",
    vertical: s.vertical,
}

export type Direction = "horizontal" | "vertical"

export type TagItemProps = {
    children?: React.ReactNode
    href: string
    direction: Direction
}

export const TagItem: React.FC<TagItemProps> = props => (
    <li>
        <Button
            href={props.href}
            size={"small"}
            disabled={true}
        >
            {props.children}
        </Button>
    </li>
)

export type TagListProps = {
    items: Tag[]
    direction: Direction
}

export const TagList: React.FC<TagListProps> = props => (
    <ul className={cx(s.tags, directionClass[props.direction])}>
        {props.items.map(x => (
            <TagItem
                key={x.slug}
                href={x.href}
                direction={props.direction}
            >
                {x.name}
            </TagItem>
        ))}
    </ul>
)
