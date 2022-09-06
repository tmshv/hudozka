import s from "./wrapper.module.css"

import cx from "classnames"

export type WrapperProps = {
    header: React.ReactNode
    footer: React.ReactNode
    style?: React.CSSProperties
    mainStyle?: React.CSSProperties
    children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = props => (
    <div className={cx(s.container, "theme-default")} style={props.style}>
        {props.header}

        <main className={s.main} style={props.mainStyle}>
            {props.children}
        </main>

        {props.footer}
    </div>
)
