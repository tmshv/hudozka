import s from './picture.module.css'

import { memo } from 'react'
import Image from 'next/image'
import { Pic } from '@/types'

const modifiers = new Map([
    ['square', s.square],
    ['vertical', s.vertical],
    ['horizontal', ''],
])

function size(w: number, h: number, tolerance: number) {
    const r = w / h
    if (r < 1 && r > tolerance) {
        return 'square'
    }

    if (w < h) {
        return 'vertical'
    }

    return 'horizontal'
}

export type PictureProps = Pic & {
    style?: React.CSSProperties
}

export const Picture: React.FC<PictureProps> = memo(props => {
    const ss = size(props.width, props.height, 0.95)
    const layout = modifiers.get(ss)

    return (
        <figure className={`${s.pic} ${layout}`}>
            <Image
                src={props.src}
                alt={props.alt}
                width={props.width}
                height={props.height}
                layout={'responsive'}
            />
            {!props.caption ? null : (
                <figcaption>{props.caption} ({props.width}x{props.height})</figcaption>
            )}
        </figure>
    )
})
