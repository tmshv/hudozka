import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type TransitionProps = {
    children?: React.ReactNode
    duration: number
    extraStyle?: React.CSSProperties
    show: boolean
}

export function Transition(props: TransitionProps) {
    const [mounted, setMounted] = useState(props.show)
    const [opacity, setOpacity] = useState(0)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    const onTransitionEnd = useCallback(() => {
        if (opacity === 0) {
            setMounted(false)
        }
    }, [opacity])
    const transition = useMemo(
        () => `all ${props.duration}ms`,
        [props.duration],
    )

    if (props.show && !mounted) {
        setMounted(true)
    }

    if (!props.show && opacity !== 0) {
        setOpacity(0)
    }

    useEffect(() => {
        if (!props.show) {
            return
        }

        timerRef.current = setTimeout(() => {
            setOpacity(1)
        }, 16)

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
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
