import cx from 'classnames'
import { createElement } from 'react'

export type BlockProps = {
    as?: keyof HTMLElementTagNameMap
    style?: React.CSSProperties
    direction: 'horizontal' | 'vertical'
}

export const Block: React.FC<BlockProps> = ({ as = 'div', style, direction, ...props }) => {
    const newProps = { className: cx(direction), style }
    const children = (
        <>
            <style jsx>{`
                div {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: baseline;
                    justify-content: flex-start;
                }

                .horizontal {
                    flex-direction: row;
                }

                .vertical {
                    flex-direction: column;
                }
            `}</style>

            {props.children}
        </>
    )

    return createElement(as, newProps, children)
}
