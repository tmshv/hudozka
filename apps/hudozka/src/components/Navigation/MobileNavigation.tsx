"use client"

import { Box } from "@hudozka/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi"
import { menu } from "@/const"
import HudozkaLogo from "../HudozkaLogo"
import { HudozkaTitle } from "../HudozkaTitle"
import { Menu } from "../Menu"
import { Spacer } from "../Spacer"
import s from "./nav.module.css"

export type MobileNavigationProps = {
    className?: string
    style?: React.CSSProperties
}

export function MobileNavigation({ className, style }: MobileNavigationProps) {
    const detailsRef = useRef<HTMLDetailsElement>(null)
    const pathname = usePathname()

    const close = useCallback(() => {
        if (detailsRef.current) {
            detailsRef.current.open = false
        }
    }, [])

    useEffect(() => {
        if (!pathname) return
        if (detailsRef.current) {
            detailsRef.current.open = false
        }
    }, [pathname])

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
                            <button type="button" className={s.toggle} onClick={close}>
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
