import * as React from 'react'
import cx from 'classnames'
import { getPathWithNoTrailingSlash } from '../../lib/url'
import { MenuToggle } from './MenuToggle'
import { useScreenType } from '../../hooks/useScreenType'
import { MenuItem } from './MenuItem'

const itemUrl = (url: string) => getPathWithNoTrailingSlash(url)

export interface IMenuProps {
    items: any[]
}

export const Menu: React.FC<IMenuProps> = props => {
    const isMobile = useScreenType(['phone', 'tablet'])
    const [open, setOpen] = React.useState(false)
    const onClick = React.useCallback(
        () => {
            setOpen(!open)
        },
        [open]
    )

    return (
        <menu>
            <style jsx>{`
                menu {
                    display: flex;
                    align-items: flex-start;
                    margin-left: 1em;
                    margin-right: 1em;

                    font-size: var(--normal-font-size);
                    list-style: none;
                }

                li {
                    padding: 0.3em 0.2em 0;
                    margin-right: 1.0em;

                    position: relative;
                    border-top: var(--menu-colored-mark-thickness) solid rgba(0, 0, 0, 0);
                }

                li:last-child {
                    margin-right: 0;
                }

                li.selected {
                    font-weight: bold;
                }

                li.selected.blue {
                    border-top-color: var(--blue-color);
                }

                li.selected.orange {
                    border-top-color: var(--orange-color);
                }

                li.selected.green {
                    border-top-color: var(--green-color);
                }

                li.selected.yellow {
                    border-top-color: var(--yellow-color);
                }

                li.selected.pink {
                    border-top-color: var(--pink-color);
                }

                li.selected.red {
                    border-top-color: var(--red-color);
                }
            `}</style>

            {isMobile ? (
                <MenuToggle
                    open={open}
                    position={'right'}
                    onClick={onClick}
                />
            ) : props.items.map((item, index) => (
                <li key={index}
                    className={cx(
                        item.color, {
                        selected: item.highlighted,
                    }
                    )}
                >
                    <MenuItem
                        url={itemUrl(item.url)}
                        text={item.text}
                        active={item.active}
                    />
                </li>
            ))}
        </menu>
    )
}
