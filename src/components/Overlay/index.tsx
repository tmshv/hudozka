import * as React from 'react'
import { Transition } from './Transition'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export interface IOverlayProps {
    show: boolean
    onClickOverlay: () => void
}

export const Overlay: React.FC<IOverlayProps> = props => {
    const motionDisabled = useReducedMotion()
    const duration = motionDisabled ? 0 : 250

    const onClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.onClickOverlay()
        }
    }, [props.onClickOverlay])

    return (
        <Transition
            duration={duration}
            show={props.show}
            extraStyle={{
                zIndex: 1000000,
            }}
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
                        overflow-y: auto;

                        background-color: rgb(255, 255, 255);
                    }
                `}</style>

                {props.children}
            </div>
        </Transition>
    )
}
