import cx from 'classnames'
import { useRouter } from 'next/router'
import { ActiveLink } from './ActiveLink'

export type MenuItemProps = {
    href: string
    layout: 'desktop' | 'mobile'
}

export const MenuItem: React.FC<MenuItemProps> = props => {
    const router = useRouter()
    const current = router.asPath === props.href
    const href = current ? null : props.href

    return (
        <li
            className={cx('menuItem', props.layout, {
                selected: current,
            })}
        >
            <ActiveLink
                href={href}
                activeStyle={{
                    fontWeight: 'bold'
                }}
            >
                {props.children}
            </ActiveLink>
        </li>
    )
}
