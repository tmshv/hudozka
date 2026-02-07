import { useCallback, useEffect, useMemo, useState } from "react"

export type TransitionProps = {
    children?: React.ReactNode
    duration: number
    extraStyle?: React.CSSProperties
    show: boolean
}

export const Transition: React.FC<TransitionProps> = props => {
    const [mounted, setMounted] = useState(props.show)
    const [opacity, setOpacity] = useState(0)
    const onTransitionEnd = useCallback(() => {
        if (opacity === 0) {
            setMounted(false)
        }
    }, [opacity])
    const transition = useMemo(
        () => `all ${props.duration}ms`,
        [props.duration],
    )

    useEffect(() => {
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
