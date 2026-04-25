import { useMobile } from "@hudozka/hooks"
import { dateFormat } from "@hudozka/utils"
import cx from "classnames"
import type { Tag } from "@/types"
import type { Direction } from "../TagList"
import { TagList } from "../TagList"
import s from "./styles.module.css"

export type PageMetaProps = {
    style?: React.CSSProperties
    date?: Date
    tags?: Tag[]
}

export const PageMeta: React.FC<PageMetaProps> = props => {
    const mobile = useMobile()
    const center = mobile ? null : "center"
    const direction: Direction = mobile ? "vertical" : "horizontal"

    return (
        <div
            className={cx(s.pageMeta, {
                [s.center]: center,
            })}
            style={props.style}
        >
            {!props.date ? null : <p className={"date"}>Опубликовано {dateFormat(props.date)}</p>}

            {!props.tags?.length ? null : <TagList direction={direction} items={props.tags} />}
        </div>
    )
}
