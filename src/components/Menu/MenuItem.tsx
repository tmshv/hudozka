import s from "./styles.module.css"
import cx from "classnames"
import { useRouter } from "next/router"
import { ActiveLink } from "./ActiveLink"
import { isPartOfPath } from "src/lib/url"

export type MenuItemProps = {
    href: string
    children?: React.ReactNode
}

export const MenuItem: React.FC<MenuItemProps> = props => {
    const ignore = ["/"]
    const router = useRouter()
    const current = router.asPath === props.href
    const selected = current || (!ignore.includes(props.href) && isPartOfPath(props.href, router.asPath))
    const href = current ? undefined : props.href

    return (
        <li
            className={cx({
                [s.selected]: selected,
            })}
        >
            <ActiveLink
                href={href}
                activeStyle={{
                    fontWeight: "bold",
                }}
            >
                {props.children}
            </ActiveLink>
        </li>
    )
}
