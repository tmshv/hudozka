import s from "./panel.module.css"

import { Box } from "../Box"

export type PanelProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: string
    ghost?: boolean
}

export function Panel({
    style,
    className,
    children,
    ghost = false,
}: PanelProps) {
    const variant = ghost ? s.ghost : s.default

    return (
        <Box vertical align={false} className={`${s.panel} ${variant}${className ? ` ${className}` : ""}`} style={style}>
            {children}
        </Box>
    )
}
