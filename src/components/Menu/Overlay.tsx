import * as React from 'react'

export interface IOverlayProps {
    opacity: number
    onClickOverlay: () => void
}

export const Overlay: React.FC<IOverlayProps> = props => {
    const onClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.onClickOverlay()
        }
    }, [props.onClickOverlay])

    return (
        <div
            style={{
                opacity: props.opacity
            }}
            onClick={onClick}
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
                }
            `}</style>

            {props.children}
        </div>
    )
}
