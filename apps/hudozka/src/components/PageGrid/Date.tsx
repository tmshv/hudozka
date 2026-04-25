import { dateFormat } from "@hudozka/utils"
import s from "./date.module.css"

export type DateLineProps = {
    style?: React.CSSProperties
    children: string | Date
}

export function DateLine(props: DateLineProps) {
    return (
        <p className={s.date} style={props.style}>
            {dateFormat(props.children)}
        </p>
    )
}
