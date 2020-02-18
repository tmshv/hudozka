import './styles.css'

import cx from 'classnames'
import { createElement } from 'react'

export type BlockProps = {
    as?: keyof HTMLElementTagNameMap
    style?: React.CSSProperties
    direction: 'horizontal' | 'vertical'
}

export const Block: React.FC<BlockProps> = ({ as = 'div', style, direction, ...props }) => {
    const newProps = { className: cx('block', direction), style }

    return createElement(as, newProps, props.children)
}
