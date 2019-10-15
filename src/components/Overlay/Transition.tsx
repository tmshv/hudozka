import * as React from 'react'

export interface ITransitionProps {
    show: boolean
}

export const Transition: React.FC<ITransitionProps> = props => {
    const [mounted, setMounted] = React.useState(props.show)
    const [opacity, setOpacity] = React.useState(0)
    const onTransitionEnd = React.useCallback(() => {
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
                transition: 'all 250ms',
            }}
            onTransitionEnd={onTransitionEnd}
        >
            {props.children}
        </div>
    )
}
