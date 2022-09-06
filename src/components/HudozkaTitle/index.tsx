import s from './title.module.css'

import { memo } from 'react'

export type HudozkaTitleProps = {
    style?: React.CSSProperties
}

export const HudozkaTitle: React.FC<HudozkaTitleProps> = memo(props => (
    <h1 style={props.style} className={s.title}>
        <span className={s.prefix}>МБУДО</span>
        Шлиссельбургская <br />
        <span className={s.suffix}>детская художественная школа</span>
    </h1>
))

HudozkaTitle.displayName = 'HudozkaTitle'
