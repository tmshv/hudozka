import { Button } from "@hudozka/ui"
import type { Tag } from "@/types"
import s from "./styles.module.css"

export type TagsIndexProps = {
    items: Tag[]
}

export function TagsIndex({ items }: TagsIndexProps) {
    return (
        <ul className={s.list}>
            {items.map(tag => (
                <li key={tag.id}>
                    <Button href={tag.href} size={"small"}>
                        {tag.name}
                        <span className={s.count}>· {tag.count}</span>
                    </Button>
                </li>
            ))}
        </ul>
    )
}
