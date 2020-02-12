import * as React from 'react'
import { MenuToggle } from '../MenuToggle'
import { useScreenType } from '../../hooks/useScreenType'
import { Menu } from '../Menu'
import { Overlay } from '../Overlay'

export interface INavigationProps {
    items: any[]
}

export const Navigation: React.FC<INavigationProps> = props => {
    const isMobile = useScreenType(['phone', 'tablet'])
    const [open, setOpen] = React.useState(false)
    const onClick = React.useCallback(
        () => {
            setOpen(!open)
        },
        [open]
    )

    return (
        <nav>
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

            {isMobile ? (
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
                        items={props.items}
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
                        items={props.items}
                    />
                </div>
            </Overlay>
        </nav>
    )
}
