import s from "./styles.module.css"

import cx from "classnames"
import { dateFormat } from "@/lib/date"
import { Tag } from "@/types"
import { TagList, Direction } from "../TagList"
import { useMobile } from "@/hooks/useMobile"

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
        <div className={cx(s.pageMeta, {
            [s.center]: center,
        })} style={props.style}>
            {!props.date ? null : (
                <p className={"date"}>Опубликовано {dateFormat(props.date)}</p>
            )}

            {!(props.tags?.length) ? null : (
                <TagList
                    direction={direction}
                    items={props.tags}
                />
            )}
        </div>
    )
}
