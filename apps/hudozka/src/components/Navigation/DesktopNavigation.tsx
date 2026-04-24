import { Menu } from "../Menu"
import { Box } from "@hudozka/ui"
import HudozkaLogo from "../HudozkaLogo"
import Link from "next/link"
import { AccessibilityButton } from "../AccessibilityButton"
import { Spacer } from "../Spacer"
import { menu } from "@/const"

export type DesktopNavigationProps = {
    className?: string
    style?: React.CSSProperties
}

export function DesktopNavigation({ style, className }: DesktopNavigationProps) {
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
