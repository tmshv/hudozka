import * as React from 'react'

export interface IOverlayProps {
    show: boolean
    onClickOverlay: () => void
}

export const Overlay: React.FC<IOverlayProps> = ({ children, ...props }) => {
    const [mounted, setMounted] = React.useState(props.show)
    const [opacity, setOpacity] = React.useState(0)
    const onClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.onClickOverlay()
        }
    }, [props.onClickOverlay])
    const onTransitionEnd = React.useCallback(() => {
        console.log('transition end', mounted, opacity)
        if (opacity === 0) {
            setMounted(false)
        }
    }, [opacity])

    React.useEffect(() => {
        if (!props.show) {
            setOpacity(0)
            return
        }

        setMounted(true)
        let t = setTimeout(() => {
            setOpacity(1)
        }, 16)

        return () => {
            clearTimeout(t)
        }
    }, [props.show])

    return mounted && (
        <div
            style={{
                opacity,
            }}
            onClick={onClick}
            onTransitionEnd={onTransitionEnd}
        >
            <style jsx>{`
                div {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 1000000;

                    background-color: rgb(255, 255, 255);
                    opacity: 0;

                    transition: all 200ms;
                }
            `}</style>

            {children}
        </div>
    )
}
