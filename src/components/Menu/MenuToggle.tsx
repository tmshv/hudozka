import * as React from 'react'
import cx from 'classnames'

export interface IMenuToggleProps {
    open: boolean
}

export const MenuToggle: React.FC<IMenuToggleProps> = props => {
    return (
        <div className={cx({
            open: props.open,
            close: !props.open,
        })}>
            <style jsx>{`
                div {
                    //position: absolute;
                    //left: 0;
                    height: var(--hmenu-icon-height);

                    margin: var(--hmenu-margin);

                    display: flex;
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

            <a href="#"></a>
        </div>
    )
}
