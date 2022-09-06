import * as React from 'react'

export interface ITransitionProps {
    duration: number
    extraStyle?: React.CSSProperties
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
    const transition = React.useMemo(
        () => `all ${props.duration}ms`,
        [props.duration]
    )

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

    if (!mounted) {
        return null
    }

    return (
        <div
            style={{
                ...props.extraStyle,
                opacity,
                transition,
            }}
            onTransitionEnd={onTransitionEnd}
        >
            {props.children}
        </div>
    )
}
