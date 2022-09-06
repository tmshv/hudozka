import { createElement } from "react"

export type SpacerProps = {
    as?: keyof HTMLElementTagNameMap
}

export const Spacer: React.FC<SpacerProps> = ({ as = "div" }) => createElement(as, {
    style: {
        flex: 1,
    },
})
