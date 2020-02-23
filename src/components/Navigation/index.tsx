import { MenuToggle } from '../MenuToggle'
import { useMobile } from 'src/hooks/useMobile'
import { Menu } from '../Menu'
import { Overlay } from '../Overlay'
import { useState, useCallback, useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'

export interface INavigationProps {
    style?: React.CSSProperties
}

export const Navigation: React.FC<INavigationProps> = props => {
    const collapseMenu = useMobile()
    const [open, setOpen] = useState(false)
    const onClick = useCallback(
        () => {
            setOpen(!open)
        },
        [open]
    )
    const { menu } = useContext(ConfigContext)

    return (
        <nav style={props.style}>
            <style jsx>{`
                nav {
                    display: flex;
                    align-items: flex-start;
                    margin-left: 1em;
                    margin-right: 1em;

                    font-size: var(--normal-font-size);
                    list-style: none;
                }
            `}</style>

            {collapseMenu ? (
                <MenuToggle
                    open={open}
                    position={'right'}
                    onClick={onClick}
                    style={{
                        zIndex: 1000001,
                    }}
                />
            ) : (
                    <Menu
                        layout={'desktop'}
                        items={menu}
                    />
                )}

            <Overlay
                show={open}
                onClickOverlay={onClick}
            >
                <div style={{
                    width: '50%',
                    margin: '50px auto',
                }}>
                    <Menu
                        layout={'mobile'}
                        items={menu}
                    />
                </div>
            </Overlay>
        </nav>
    )
}
