import { createElement } from "react"

export type TitleProps = {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export const Title: React.FC<TitleProps> = ({ level = 1, children, ...props }) => {
    return createElement(`h${level}`, props, children)
}
