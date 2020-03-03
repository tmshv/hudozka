import './styles.css'
import { memo } from 'react'

export type ImageProps = {
    style?: React.CSSProperties
    imgStyle?: React.CSSProperties
    src: string
    alt?: string
    srcSet?: string
}

export const Image: React.FC<ImageProps> = memo(props => {
    return (
        <picture className={'image'} style={props.style}>
            <img
                style={props.imgStyle}
                alt={props.alt}
                src={props.src}
                srcSet={props.srcSet}
            />
        </picture>
    )
})
