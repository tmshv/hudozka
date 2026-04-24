import s from "./date.module.css"

import { dateFormat } from "@hudozka/utils"

export type DateProps = {
    style?: React.CSSProperties
    children: string | Date
}
export const Date: React.FC<DateProps> = props => (
    <p className={s.date} style={props.style}>
        {dateFormat(props.children)}
    </p>
)
