import * as React from 'react'
import { Navigation } from '../Navigation'

const Header: React.FC<any> = props => (
    <Navigation items={props.menuItems} />
)

export default Header
