import type { Tag } from "@/types"

import { PageMeta } from "../PageMeta"
import s from "./styles.module.css"

export type PageProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    date?: Date
    tags: Tag[]
}

export const Page: React.FC<PageProps> = props => (
    <div className={s.page} style={props.style}>
        {props.children}

        <PageMeta
            style={{
                marginTop: "var(--size-m)",
            }}
            date={props.date}
            tags={props.tags}
        />
    </div>
)
