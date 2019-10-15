import * as React from 'react'
import cx from 'classnames'
import { getPathWithNoTrailingSlash } from '../../lib/url'
import { MenuItem } from './MenuItem'

const itemUrl = (url: string) => getPathWithNoTrailingSlash(url)

export interface IMenuProps {
    layout: 'desktop' | 'mobile'
    items: any[]
}

export const Menu: React.FC<IMenuProps> = props => {
    return (
        <div className={cx(props.layout)}>
            <style jsx>{`
                div {
                    display: flex;
                    align-items: flex-start;

                    list-style: none;
                }

                div.desktop {
                    flex-direction: row;
                }
 
                div.mobile {
                    flex-direction: column;
                }
                
                li{
                    position: relative;
                    border-top: var(--menu-colored-mark-thickness) solid rgba(0, 0, 0, 0);
                }

                li.desktop {
                    padding: 0.3em 0.2em 0;
                    margin-left: 1em;
                    margin-right: 1em;

                    font-size: var(--normal-font-size);
                }

                li.mobile {
                    padding: 0.3em 0.5em;
                    margin-bottom: var(--half-margin);

                    font-size: 1.25em;
                }

                li:last-child {
                    margin-right: 0;
                }

                li.selected {
                    font-weight: bold;
                }

                li.desktop.selected.blue {
                    border-top-color: var(--blue-color);
                }

                li.desktop.selected.orange {
                    border-top-color: var(--orange-color);
                }

                li.desktop.selected.green {
                    border-top-color: var(--green-color);
                }

                li.desktop.selected.yellow {
                    border-top-color: var(--yellow-color);
                }

                li.desktop.selected.pink {
                    border-top-color: var(--pink-color);
                }

                li.desktop.selected.red {
                    border-top-color: var(--red-color);
                }

                li.mobile.selected.blue {
                    background-color: var(--blue-color);
                }

                li.mobile.selected.orange {
                    background-color: var(--orange-color);
                }

                li.mobile.selected.green {
                    background-color: var(--green-color);
                }

                li.mobile.selected.yellow {
                    background-color: var(--yellow-color);
                }

                li.mobile.selected.pink {
                    background-color: var(--pink-color);
                }

                li.mobile.selected.red {
                    background-color: var(--red-color);
                }
            `}</style>

            {props.items.map((item, index) => (
                <li key={index}
                    className={cx(
                        props.layout,
                        item.color, {
                        selected: item.highlighted,
                    })}
                >
                    <MenuItem
                        url={itemUrl(item.url)}
                        text={item.text}
                        active={item.active}
                    />
                </li>
            ))}
        </div>
    )
}
