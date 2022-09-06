import { MenuToggle } from "../MenuToggle"
import { useMobile } from "src/hooks/useMobile"
import { Menu } from "../Menu"
import { Overlay } from "@/ui/Overlay"
import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import { Box } from "@/ui/Box"
import { Spacer } from "../Spacer"
import { useToggle } from "react-use"

export type NavigationProps = {
    style?: React.CSSProperties
}

export const Navigation: React.FC<NavigationProps> = props => {
    const collapseMenu = useMobile()
    const [open, toggleOpen] = useToggle(false)
    const { menu } = useContext(ConfigContext)

    return (
        <>
            <Overlay
                show={open}
                onClickOverlay={toggleOpen}
                duration={250}
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

            <Box wrap style={{
                padding: "var(--size-s)",
            }}>
                {collapseMenu ? null : (
                    <Menu
                        items={menu}
                    />
                )}

                <Spacer />

                {!collapseMenu ? null : (
                    <MenuToggle
                        open={open}
                        onClick={toggleOpen}
                    />
                )}
            </Box>
        </>
    )
}
