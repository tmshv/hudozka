import s from "./panel.module.css"

import { Box } from "../Box"

export type PanelProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    ghost?: boolean
}

export const Panel: React.FC<PanelProps> = ({
    style,
    children,
    ghost = false,
}) => {
    const variant = ghost ? s.ghost : s.default

    return (
        <Box vertical align={false} className={`${s.panel} ${variant}`} style={style}>
            {children}
        </Box>
    )
}
