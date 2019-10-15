import * as React from 'react'
import { Menu } from '../Menu'

const Header: React.FC<any> = props => (
    <Menu items={props.menuItems} />
)

export default Header
