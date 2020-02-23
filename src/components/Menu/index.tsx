import './styles.css'

import cx from 'classnames'
import { MenuItem } from './MenuItem'
import { IMenu } from 'src/types'

export type MenuProps = {
    layout: 'desktop' | 'mobile'
    items: IMenu[]
}

export const Menu: React.FC<MenuProps> = props => (
    <menu className={cx('menu', props.layout)}>
        {props.items.map((item, index) => (
            <MenuItem key={index}
                href={item.href}
                layout={props.layout}
            >
                {item.name}
            </MenuItem>
        ))}
    </menu>
)
