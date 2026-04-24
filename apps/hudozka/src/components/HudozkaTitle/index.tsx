import s from "./title.module.css"

import { memo } from "react"

export type HudozkaTitleProps = {
    compact?: boolean
    style?: React.CSSProperties
}

export const HudozkaTitle: React.FC<HudozkaTitleProps> = memo(({ style, compact = false }) => {
    if (compact) {
        return (
            <span>
                Шлиссельбургская ДХШ
            </span>
        )
    }
    return (
        <h1 style={style} className={s.title}>
            <span className={s.prefix}>МБУДО</span>
            Шлиссельбургская <br />
            <span className={s.suffix}>детская художественная школа</span>
        </h1>
    )
})

HudozkaTitle.displayName = "HudozkaTitle"
