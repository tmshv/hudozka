"use client"

import s from "./wrapper.module.css"

import cx from "classnames"
import { useSnapshot } from "valtio"
import { theme } from "@/store/theme"

export type WrapperProps = {
    header: React.ReactNode
    footer: React.ReactNode
    style?: React.CSSProperties
    mainStyle?: React.CSSProperties
    children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = props => {
    const t = useSnapshot(theme)

    return (
        <div className={cx(s.container, `theme-${t.theme}`, `font-${t.fontType}`, t.colorScheme ?? "black-on-white", !t.showImages ? "no-images" : null)} style={props.style}>
            {props.header}

            <main className={s.main} style={props.mainStyle}>
                {props.children}
            </main>

            {props.footer}
        </div>
    )
}
