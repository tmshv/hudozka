import s from './styles.module.css'

import cx from 'classnames'
import Link from 'next/link'
import { Image } from '../Image'

const layoutClass = {
    simple: s.simple,
    featured: s.featured,
}

export type CardLayout = 'simple' | 'featured'
export type CardProps = {
    style?: React.CSSProperties
    href: string
    img: {
        alt: string
        src: string
        srcSet: string
    }
    layout: CardLayout
}

export const Card: React.FC<CardProps> = props => (
    <div className={cx(s.card, layoutClass[props.layout])} style={props.style}>
        <Link href={props.href}>
            <a>
                <div className={s.image}>
                    <Image
                        alt={props.img.alt}
                        src={props.img.src}
                        srcSet={props.img.srcSet}
                    />
                </div>

                <div className={s.body}>
                    {props.children}
                </div>
            </a>
        </Link>
    </div>
)
