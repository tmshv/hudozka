import s from './styles.module.css'

import { Transition } from './Transition'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useCallback, useEffect } from 'react'

export interface IOverlayProps {
    show: boolean
    onClickOverlay: () => void
    style?: React.CSSProperties
}

export const Overlay: React.FC<IOverlayProps> = props => {
    const motionDisabled = useReducedMotion()
    const onClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.onClickOverlay()
        }
    }, [props.onClickOverlay])
    const duration = motionDisabled ? 0 : 250

    useEffect(() => {
        if (props.show) {
            document.body.classList.add('noscroll')
        } else {
            document.body.classList.remove('noscroll')
        }
    }, [props.show])

    return (
        <Transition
            duration={duration}
            show={props.show}
        >
            <div
                onClick={onClick}
                className={s.overlay}
                style={props.style}
            >
                {props.children}
            </div>
        </Transition>
    )
}
