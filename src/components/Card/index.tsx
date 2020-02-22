import './styles.css'
import cx from 'classnames'
import Link from 'next/link'

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
    <div className={cx('card', props.layout)} style={props.style}>
        <Link href={props.href}>
            <a>
                <div className={'card-image'}>
                    <img
                        className={cx({ opa: false })}
                        alt={props.img.alt}
                        src={props.img.src}
                        srcSet={props.img.srcSet}
                    />
                </div>

                <div className={'card-body'}>
                    {props.children}
                </div>
            </a>
        </Link>
    </div>
)
