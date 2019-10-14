import React from 'react'
import {getPathWithNoTrailingSlash} from '../lib/url'

const itemUrl = url => getPathWithNoTrailingSlash(url)

const selectedClassName = flag => flag
    ? 'selected'
    : ''

const hmenuCurClassName = flag => flag
    ? 'HMenu__item--cur'
    : ''

const MenuItem = ({ active, text, url }) => active
    ? (
        <span>{text}</span>
    ) : (
        <a href={itemUrl(url)}>{text}</a>
    )

const MenuToggle = () => (
    <div className="HMenu__toggle">
        <a href="#"></a>
    </div>
)

export const Menu = ({ items }) => (
    <menu className="main-menu HMenu" data-toggle-width="1024">
        <MenuToggle />

        {items.map((item, index) => (
            <li key={index}
                className={`HMenu__item ${hmenuCurClassName(item.highlighted)} ${item.color} ${selectedClassName(item.highlighted)}`}
            >
                <MenuItem {...item} />
            </li>
        ))}
    </menu>
)
