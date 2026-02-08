import { Menu } from "../Menu"
import { useContext } from "react"
import { MenuContext } from "@/context/MenuContext"
import { Box } from "@/ui/Box"
import HudozkaLogo from "../HudozkaLogo"
import Link from "next/link"
import { AccessibilityButton } from "../AccessibilityButton"
import { Spacer } from "../Spacer"

export type DesktopNavigationProps = {
    className?: string
    style?: React.CSSProperties
}

export function DesktopNavigation({ style, className }: DesktopNavigationProps) {
    const menu = useContext(MenuContext)

    return (
        <Box wrap className={className} gap={"var(--size-s)"} style={style}>
            <Link href="/">
                <HudozkaLogo />
            </Link>

            <Menu
                items={menu}
            />

            <Spacer />
            <AccessibilityButton />
        </Box>
    )
}

