import s from "./nav.module.css"

import { Menu } from "../Menu"
import { useCallback, useContext, useEffect, useRef } from "react"
import { MenuContext } from "@/context/MenuContext"
import { Box } from "@/ui/Box"
import { Spacer } from "../Spacer"
import HudozkaLogo from "../HudozkaLogo"
import { HudozkaTitle } from "../HudozkaTitle"
import Link from "next/link"
import { useRouter } from "next/router"
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi"

export type MobileNavigationProps = {
    className?: string
    style?: React.CSSProperties
}

export function MobileNavigation({ className, style }: MobileNavigationProps) {
    const menu = useContext(MenuContext)
    const detailsRef = useRef<HTMLDetailsElement>(null)
    const router = useRouter()

    const close = useCallback(() => {
        if (detailsRef.current) {
            detailsRef.current.open = false
        }
    }, [])

    useEffect(() => {
        router.events.on("routeChangeStart", close)
        return () => {
            router.events.off("routeChangeStart", close)
        }
    }, [router.events, close])

    return (
        <nav className={className}>
            <Box wrap gap={"var(--size-s)"} style={style}>
                <Link href="/">
                    <HudozkaLogo />
                </Link>
                <HudozkaTitle compact />
                <Spacer />
                <details className={s.details} ref={detailsRef}>
                    <summary className={s.toggle}>
                        <HiOutlineMenuAlt4 className={s.iconOpen} size={24} />
                        <HiOutlineX className={s.iconClose} size={24} />
                    </summary>
                    <div className={s.panel}>
                        <div className={s.panelClose}>
                            <button className={s.toggle} onClick={close}>
                                <HiOutlineX size={24} />
                            </button>
                        </div>
                        <Menu vertical items={menu} onItemClick={close} />
                    </div>
                </details>
            </Box>
        </nav>
    )
}
