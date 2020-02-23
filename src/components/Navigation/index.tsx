import { MenuToggle } from '../MenuToggle'
import { useMobile } from 'src/hooks/useMobile'
import { Menu } from '../Menu'
import { Overlay } from '../Overlay'
import { useState, useCallback, useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'
import { Block } from '../Block'
import { Spacer } from '../Spacer'

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
        <>
            <Overlay
                show={open}
                onClickOverlay={onClick}
            >
                <Block direction={'horizontal'}>
                    <Spacer />
                    <MenuToggle
                        open={open}
                        onClick={onClick}
                        style={{
                            margin: 'var(--size-xs)'
                        }}
                    />
                </Block>
                <Block direction={'horizontal'} style={{
                    justifyContent: 'center',
                }}>
                    <nav style={{
                        width: '75%',
                    }}>
                        <Menu
                            layout={'mobile'}
                            items={menu}
                        />
                    </nav>
                </Block>
            </Overlay>

            {collapseMenu ? (
                <Block direction={'horizontal'}>
                    <Spacer />
                    <MenuToggle
                        open={open}
                        onClick={onClick}
                        style={{
                            margin: 'var(--size-xs)'
                        }}
                    />
                </Block>
            ) : (
                    <nav style={props.style}>
                        <Menu
                            layout={'desktop'}
                            items={menu}
                        />
                    </nav>
                )}
        </>
    )
}
