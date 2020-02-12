import * as React from 'react'
import cx from 'classnames'

export interface IImageProps {
    style?: React.CSSProperties
    imgStyle?: React.CSSProperties
    src: string
    alt: string
    opa: boolean
    set: Array<{
        url: string
        density: number
    }>
}

export const Image: React.FC<IImageProps> = React.memo(props => {
    const srcSet = props.set
        .map(({ url, density }) => `${url} ${density}x`)
        .join(' ')

    return (
        <picture style={props.style}>
            <style jsx>{`
                picture img {
                    display: block;
                }
            `}</style>

            <img
                style={props.imgStyle}
                className={cx({
                    opa: props.opa
                })}
                alt={props.alt}
                src={props.src}
                srcSet={srcSet}
            />
        </picture >
    )
})
