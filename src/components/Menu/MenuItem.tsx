import cx from 'classnames'
import { useRouter } from 'next/router'
import { ActiveLink } from './ActiveLink'
import { isPartOfPath } from 'src/lib/url'

export type MenuItemProps = {
    href: string
    layout: 'desktop' | 'mobile'
}

export const MenuItem: React.FC<MenuItemProps> = props => {
    const ignore = ['/']
    const router = useRouter()
    const current = router.asPath === props.href
    const selected = current || (!ignore.includes(props.href) && isPartOfPath(props.href, router.asPath))
    const href = current ? null : props.href

    return (
        <li
            className={cx('menuItem', props.layout, {
                selected,
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
