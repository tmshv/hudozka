import { MenuToggle } from "../MenuToggle"
import { useMobile } from "src/hooks/useMobile"
import { Menu } from "../Menu"
import { Overlay } from "@/ui/Overlay"
import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import { Box } from "@/ui/Box"
import { Spacer } from "../Spacer"
import { useToggle } from "react-use"
import { HudozkaLogo } from "../HudozkaLogo"
import { useDarkTheme } from "@/hooks/useDarkTheme"
import { HudozkaTitle } from "../HudozkaTitle"
import Link from "next/link"

export type NavigationProps = {
    style?: React.CSSProperties
}

export const Navigation: React.FC<NavigationProps> = props => {
    const mobile = useMobile()
    const dark = useDarkTheme()
    const [open, toggleOpen] = useToggle(false)
    const { menu } = useContext(ConfigContext)

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

            <Box wrap gap={"var(--size-s)"} style={{
                padding: "var(--size-s)",
            }}>
                <Link href="/">
                    <a>
                        <HudozkaLogo dark={dark} />
                    </a>
                </Link>

                {!mobile ? null : (
                    <HudozkaTitle compact />
                )}

                {mobile ? null : (
                    <Menu
                        items={menu}
                        onItemClick={() => {
                            toggleOpen(false)
                        }}
                    />
                )}

                <Spacer />

                {!mobile ? null : (
                    <MenuToggle
                        open={open}
                        onClick={toggleOpen}
                    />
                )}
            </Box>
        </>
    )
}
