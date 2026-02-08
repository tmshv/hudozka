import { useReducer } from "react"

export function useToggle(initialValue: boolean): [boolean, (nextValue?: boolean) => void] {
    return useReducer(
        (state: boolean, next?: boolean) => typeof next === "boolean" ? next : !state,
        initialValue,
    )
}
