import { MenuToggle } from "../MenuToggle"
import { useMobile } from "src/hooks/useMobile"
import { Menu } from "../Menu"
import { Overlay } from "@/ui/Overlay"
import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import { Block } from "../Block"
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
                <Block direction={"horizontal"} align style={{
                    padding: "var(--size-s)",
                }}>
                    <Spacer />
                    <MenuToggle
                        open={open}
                        onClick={toggleOpen}
                    />
                </Block>
                <Block direction={"horizontal"} style={{
                    justifyContent: "center",
                }}>
                    <Menu vertical
                        items={menu}
                    />
                </Block>
            </Overlay>

            <Block direction={"horizontal"} align style={{
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
                        style={{
                            margin: "var(--size-xs)",
                        }}
                    />
                )}
            </Block>
        </>
    )
}
