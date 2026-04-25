import { Box } from "@hudozka/ui"
import Link from "next/link"
import { menu } from "@/const"
import { AccessibilityButton } from "../AccessibilityButton"
import HudozkaLogo from "../HudozkaLogo"
import { Menu } from "../Menu"
import { Spacer } from "../Spacer"

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

            <Menu items={menu} />

            <Spacer />
            <AccessibilityButton />
        </Box>
    )
}
