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
        <menu className="main-menu HMenu" data-toggle-width="1024">
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
