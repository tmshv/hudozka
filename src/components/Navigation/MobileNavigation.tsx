import { MenuToggle } from "../MenuToggle"
import { Menu } from "../Menu"
import { Overlay } from "@/ui/Overlay"
import { useCallback, useContext } from "react"
import { MenuContext } from "@/context/MenuContext"
import { Box } from "@/ui/Box"
import { Spacer } from "../Spacer"
import { useToggle } from "@/hooks/useToggle"
import HudozkaLogo from "../HudozkaLogo"
import { HudozkaTitle } from "../HudozkaTitle"
import Link from "next/link"

export type MobileNavigationProps = {
    style?: React.CSSProperties
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ style }) => {
    const [open, toggleOpen] = useToggle(false)
    const handleToggle = useCallback(() => toggleOpen(), [toggleOpen])
    const menu = useContext(MenuContext)

    return (
        <>
            <Overlay
                show={open}
                onClickOverlay={toggleOpen}
                // duration={250}
                duration={0}
            >
                <Box style={{
                    padding: "var(--size-s)",
                }}>
                    <Spacer />
                    <MenuToggle
                        open={open}
                        onClick={handleToggle}
                    />
                </Box>
                <Box style={{
                    justifyContent: "center",
                }}>
                    <Menu vertical
                        items={menu}
                    />
                </Box>
            </Overlay>

            <Box wrap gap={"var(--size-s)"} style={style}>
                <Link href="/">
                    <HudozkaLogo />
                </Link>
                <HudozkaTitle compact />
                <Spacer />
                <MenuToggle
                    open={open}
                    onClick={handleToggle}
                />
            </Box>
        </>
    )
}
