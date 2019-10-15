import * as React from 'react'
import cx from 'classnames'
import { getPathWithNoTrailingSlash } from '../../lib/url'
import { MenuToggle } from './MenuToggle'
import { useScreenType } from '../../hooks/useScreenType'

const itemUrl = (url: string) => getPathWithNoTrailingSlash(url)

const selectedClassName = (flag: boolean) => flag
    ? 'selected'
    : ''

const hmenuCurClassName = (flag: boolean) => flag
    ? 'HMenu__item--cur'
    : ''

const MenuItem = ({ active, text, url }) => active
    ? (
        <span>{text}</span>
    ) : (
        <a href={itemUrl(url)}>{text}</a>
    )

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

    React.useEffect(() => {
        console.log(isMobile)
    }, [isMobile])

    return (
        <menu className="main-menu HMenu">
            <style jsx>{`
                .main-menu {
                    font-size: var(--normal-font-size);
                }

                .main-menu li {
                    display: inline-block;
                    padding: 0.3em 0.2em 0;
                    margin: 0 0.5em;

                    position: relative;
                }

                .main-menu li:first-child {
                    margin-left: 1em;
                }

                .selected {
                    font-weight: bold;
                    border-top: var(--menu-colored-mark-thickness) solid var(--light-color);
                }

                .selected.blue {
                    border-top-color: var(--blue-color);
                }

                .selected.orange {
                    border-top-color: var(--orange-color);
                }

                .selected.green {
                    border-top-color: var(--green-color);
                }

                .selected.yellow {
                    border-top-color: var(--yellow-color);
                }

                .selected.pink {
                    border-top-color: var(--pink-color);
                }

                .selected.red {
                    border-top-color: var(--red-color);
                }
            `}</style>

            {!isMobile ? null : (
                <MenuToggle
                    open={open}
                    position={'right'}
                    onClick={onClick}
                />
            )}

            {props.items.map((item, index) => (
                <li key={index}
                    className={cx(
                        'HMenu__item',
                        hmenuCurClassName(item.highlighted),
                        selectedClassName(item.highlighted),
                        item.color,
                    )}
                >
                    <MenuItem {...item} />
                </li>
            ))}
        </menu>
    )
}
