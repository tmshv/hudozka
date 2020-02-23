import './styles.css'

import cx from 'classnames'
import { Button } from '../Button'

export interface IMenuToggleProps {
    style?: React.CSSProperties
    open: boolean
    onClick: () => void
}

export const MenuToggle: React.FC<IMenuToggleProps> = props => {
    return (
        <Button
            onClick={props.onClick}
            style={props.style}
            theme={'icon'}
        >
            <div
                className={cx('toggle', {
                    open: props.open,
                    close: !props.open,
                })}
            />
        </Button>
    )
}
