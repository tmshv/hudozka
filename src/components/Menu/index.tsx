import './styles.css'

import cx from 'classnames'
import { MenuItem } from './MenuItem'

export type MenuProps = {
    layout: 'desktop' | 'mobile'
    items: any[]
}

export const Menu: React.FC<MenuProps> = props => (
    <menu className={cx('menu', props.layout)}>
        {props.items.map((item, index) => (
            <MenuItem key={index}
                href={item.url}
                layout={props.layout}
            >
                {item.text}
            </MenuItem>
        ))}
    </menu>
)
