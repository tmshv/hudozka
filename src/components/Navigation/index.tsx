import { useMobile } from "src/hooks/useMobile"
import { DesktopNavigation } from "./DesktopNavigation"
import { MobileNavigation } from "./MobileNavigation"

export type NavigationProps = {
    style?: React.CSSProperties
}

export const Navigation: React.FC<NavigationProps> = ({ style }) => {
    const mobile = useMobile()

    if (mobile) {
        return (
            <MobileNavigation style={style} />
        )
    }

    return (
        <DesktopNavigation style={style} />
    )
}
