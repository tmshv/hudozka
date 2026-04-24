import { useCallback, useState } from "react"

export function useToggle(initialValue: boolean): [boolean, (nextValue?: boolean) => void] {
    const [state, setState] = useState(initialValue)
    const toggle = useCallback((next?: boolean) => {
        setState(prev => typeof next === "boolean" ? next : !prev)
    }, [])
    return [state, toggle]
}
