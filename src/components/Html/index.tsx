import { createElement } from 'react'

export type HtmlProps = {
    className?: string
    as?: keyof HTMLElementTagNameMap
    html: string
}

export const Html: React.FC<HtmlProps> = ({ as = 'div', ...props }) => {
    return createElement(as, {
        className: props.className,
        dangerouslySetInnerHTML: {
            __html: props.html,
        },
    })
}
