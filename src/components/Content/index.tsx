import cx from "classnames"
import { useReducedMotion } from "src/hooks/useReducedMotion"

export type ContentProps = {
    style?: React.CSSProperties
    children?: React.ReactNode
}

export const Content: React.FC<ContentProps> = props => {
    const motionDisabled = useReducedMotion()

    return (
        <div
            className={cx("content", {
                "reduced-motion": motionDisabled,
            })}
            style={props.style}
        >
            {props.children}
        </div>
    )
}
