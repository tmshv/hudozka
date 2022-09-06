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
    wide?: boolean
}

export const Picture: React.FC<PictureProps> = memo(({ wide = false, ...props }) => {
    const ss = size(props.width, props.height, 0.95)
    const layout = modifiers.get(ss)
    const w = ss === 'horizontal' ? wide : false

    return (
        <figure className={`${s.pic} ${layout} ${w ? s.wide : ''}`}>
            <Image
                className={s.img}
                src={props.src}
                alt={props.alt}
                width={props.width}
                height={props.height}
                layout={'responsive'}
                blurDataURL={props.blur}
                placeholder={'blur'}
            />
            {!props.caption ? null : (
                <figcaption>{props.caption}</figcaption>
            )}
        </figure>
    )
})

Picture.displayName = 'Picture'
