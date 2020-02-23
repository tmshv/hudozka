import cx from 'classnames'
import { useReducedMotion } from 'src/hooks/useReducedMotion'

export type ContentProps = {
    style?: React.CSSProperties
    wide: boolean
}

export const Content: React.FC<ContentProps> = props => {
    const motionDisabled = useReducedMotion()

    return (
        <div
            className={cx('content', {
                'reduced-motion': motionDisabled,
                'content_wide': props.wide,
            })}
            style={props.style}
        >
            {props.children}
        </div>
    )
}
