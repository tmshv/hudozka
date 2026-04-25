import { useReducedMotion } from "@hudozka/hooks"
import cx from "classnames"

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
