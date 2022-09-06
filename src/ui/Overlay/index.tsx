import s from "./styles.module.css"

import { Transition } from "./Transition"
import { useReducedMotion } from "../../hooks/useReducedMotion"
import { useLockBodyScroll } from "react-use"

export type OverlayProps = {
    children?: React.ReactNode
    show: boolean
    onClickOverlay: () => void
    style?: React.CSSProperties
    duration: number
}

export const Overlay: React.FC<OverlayProps> = props => {
    const motionDisabled = useReducedMotion()
    const duration = motionDisabled ? 0 : props.duration

    useLockBodyScroll(props.show)

    return (
        <Transition
            duration={duration}
            show={props.show}
        >
            <div
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        props.onClickOverlay()
                    }
                }}
                className={s.overlay}
                style={props.style}
            >
                {props.children}
            </div>
        </Transition>
    )
}
