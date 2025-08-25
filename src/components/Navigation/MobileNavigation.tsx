import { MenuToggle } from "../MenuToggle"
import { Menu } from "../Menu"
import { Overlay } from "@/ui/Overlay"
import { useContext } from "react"
import { MenuContext } from "@/context/MenuContext"
import { Box } from "@/ui/Box"
import { Spacer } from "../Spacer"
import { useToggle } from "react-use"
import { HudozkaLogo } from "../HudozkaLogo"
import { useDarkTheme } from "@/hooks/useDarkTheme"
import { HudozkaTitle } from "../HudozkaTitle"
import Link from "next/link"

export type MobileNavigationProps = {
    style?: React.CSSProperties
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ style }) => {
    const dark = useDarkTheme()
    const [open, toggleOpen] = useToggle(false)
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
                        onClick={toggleOpen}
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
                    <HudozkaLogo dark={dark} />
                </Link>
                <HudozkaTitle compact />
                <Spacer />
                <MenuToggle
                    open={open}
                    onClick={toggleOpen}
                />
            </Box>
        </>
    )
}
