import './styles.css'

import cx from 'classnames'
import { ActiveLink } from './ActiveLink'

export interface IMenuProps {
    layout: 'desktop' | 'mobile'
    items: any[]
}

export const Menu: React.FC<IMenuProps> = props => (
    <div className={cx('menu', props.layout)}>
        {props.items.map((item, index) => (
            <li key={index}
                className={cx('menuItem', props.layout, {
                    selected: item.highlighted
                })}
            >
                <ActiveLink
                    href={!item.active ? item.url : null}
                    activeStyle={{
                        fontWeight: 'bold',
                    }}
                >
                    {item.text}
                </ActiveLink>
            </li>
        ))}
    </div>
)
