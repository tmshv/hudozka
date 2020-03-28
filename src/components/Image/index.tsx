import s from './styles.module.css'

import { memo, useRef, useEffect, useCallback } from 'react'

export type ImageProps = {
    style?: React.CSSProperties
    src: string
    alt?: string
    srcSet?: string
}

export const Image: React.FC<ImageProps> = memo(props => {
    const ref = useRef<HTMLImageElement>()
    const onLoad = useCallback((event) => {
        event.target.classList.add('loaded')
        event.target.classList.remove('pending')
    }, [])

    useEffect(() => {
        if (ref.current) {
            ref.current.classList.add('pending')
        }
    })

    return (
        <img
            ref={ref}
            onLoad={onLoad}
            className={s.image}
            style={props.style}
            alt={props.alt}
            src={props.src}
            srcSet={props.srcSet}
        />
    )
})
