import { useMobile } from "src/hooks/useMobile"
import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import { useToggle } from "react-use"
import { useDarkTheme } from "@/hooks/useDarkTheme"
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
