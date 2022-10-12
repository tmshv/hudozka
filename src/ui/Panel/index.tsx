import s from "./panel.module.css"

import { Box } from "../Box"

export type PanelProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
}

export const Panel: React.FC<PanelProps> = ({
    style,
    children,
}) => {
    return (
        <Box vertical align={false} className={`${s.panel} ${s.default}`} style={style}>
            {children}
        </Box>
    )
}
