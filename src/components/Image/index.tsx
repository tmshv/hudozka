import './styles.css'
import { memo, useRef, useState, useEffect, useCallback } from 'react'

export type ImageProps = {
    style?: React.CSSProperties
    src: string
    alt?: string
    srcSet?: string
}

export const Image: React.FC<ImageProps> = memo(props => {
    const [imageSrc, setImageSrc] = useState<[string, string]>([null, null])
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

    useEffect(() => {
        let observer: IntersectionObserver
        let didCancel = false

        if (ref.current && imageSrc[0] !== props.src) {
            if (IntersectionObserver) {
                observer = new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (
                                !didCancel &&
                                (entry.intersectionRatio > 0 || entry.isIntersecting)
                            ) {
                                setImageSrc([props.src, props.srcSet])
                                observer.unobserve(ref.current)
                            }
                        })
                    },
                    {
                        threshold: 0.01,
                        rootMargin: "75%",
                    }
                )
                observer.observe(ref.current)
            } else {
                // Old browsers fallback
                setImageSrc([props.src, props.srcSet])
            }
        }
        return () => {
            didCancel = true
            if (observer && observer.unobserve) {
                observer.unobserve(ref.current)
            }
        }
    }, [props.src, props.srcSet, imageSrc, ref])

    return (
        <img
            ref={ref}
            onLoad={onLoad}
            className={'image'}
            style={props.style}
            alt={props.alt}
            src={imageSrc[0]}
            srcSet={imageSrc[1]}
        />
    )
})
