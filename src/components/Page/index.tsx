import s from "./styles.module.css"

import { PageMeta } from "../PageMeta"
import { ITag } from "src/types"

export type PageProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    date?: Date
    tags: ITag[]
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
