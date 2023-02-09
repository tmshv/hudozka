import { Menu } from "../Menu"
import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import { Box } from "@/ui/Box"
import { HudozkaLogo } from "../HudozkaLogo"
import { useDarkTheme } from "@/hooks/useDarkTheme"
import Link from "next/link"

export type DesktopNavigationProps = {
    style?: React.CSSProperties
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ style }) => {
    const dark = useDarkTheme()
    const { menu } = useContext(ConfigContext)

    return (
        <Box wrap gap={"var(--size-s)"} style={style}>
            <Link href="/">
                <HudozkaLogo dark={dark} />
            </Link>

            <Menu
                items={menu}
            />
        </Box>
    )
}
