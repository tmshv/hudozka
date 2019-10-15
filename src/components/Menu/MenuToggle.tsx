import * as React from 'react'
import cx from 'classnames'

export interface IMenuToggleProps {
    style?: React.CSSProperties
    open: boolean
    position: 'left' | 'right'
    onClick: () => void
}

export const MenuToggle: React.FC<IMenuToggleProps> = props => {
    return (
        <div
            className={cx(props.position, {
                open: props.open,
                close: !props.open,
            })}
            style={props.style}
        >
            <style jsx>{`
                div {
                    position: absolute;
                    height: var(--hmenu-icon-height);
                    margin: var(--hmenu-margin);
                    display: flex;
                }

                div.right {
                    top: 0;
                    right: 0;
                }

                div.left {
                    top: 0;
                    left: 0;
                }

                a {
                    text-decoration: none;
                    border: none;

                    width: var(--hmenu-icon-width);
                    height: var(--hmenu-icon-height);
                    background-size: 100%;
                }

                a:hover {
                    text-decoration: none;
                    border: none;
                }

                div.open a {
                    background-image: url(/static/graphics/hmenu-close-b.png);
                }

                div.open a:hover {
                    background-image: url(/static/graphics/hmenu-close-hover-b.png);
                }

                div.close a {
                    background-image: url(/static/graphics/hmenu-b.png);
                }

                div.close a:hover {
                    background-image: url(/static/graphics/hmenu-hover-b.png);
                }
            `}</style>

            <a
                href="#"
                onClick={props.onClick}
            ></a>
        </div>
    )
}
