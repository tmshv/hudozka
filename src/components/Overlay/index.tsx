import * as React from 'react'
import { Transition } from './Transition'

export interface IOverlayProps {
    show: boolean
    onClickOverlay: () => void
}

export const Overlay: React.FC<IOverlayProps> = props => {
    const onClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.onClickOverlay()
        }
    }, [props.onClickOverlay])

    React.useEffect(() => {
        document.body.classList.toggle('noscroll', props.show)

    }, [props.show])

    return (
        <Transition
            show={props.show}
        >
            <div
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
        </Transition>
    )
}
