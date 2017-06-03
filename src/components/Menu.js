const React = require('react')
const getPathWithNoTrailingSlas = require('../lib/url').getPathWithNoTrailingSlash

const hasSubmenu = item => !!item.items
const doDrawSubmenu = item => false //item.active && hasSubmenu(item)
const itemUrl = url => getPathWithNoTrailingSlas(url)

const selectedClassName = flag => flag
	? 'selected'
	: ''

const hmenuCurClassName = flag => flag
	? 'HMenu__item--cur'
	: ''

const MenuItem = ({active, text, url}) => (active
		? <span>{text}</span>
		: <a href={itemUrl(url)}>{text}</a>
)

const MenuToggle = () => (
	<div className="HMenu__toggle">
		<a href="#"></a>
	</div>
)

const Menu = ({items}) => {
	const content = items.map((item, index) => (
		<li key={index}
			className={`HMenu__item ${hmenuCurClassName(item.highlighted)} ${item.color} ${selectedClassName(item.highlighted)}`}
		>
			<MenuItem {...item}/>

			{!doDrawSubmenu(item) ? null : (
				<Submenu key={index} items={item.items}/>
			)}
		</li>
	))
	return (
		<menu className="main-menu HMenu" data-toggle-width="900">
			<MenuToggle/>

			{content}
		</menu>
	)
}

const Submenu = ({items}) => (
	<menu className="main-menu__submenu">
		{items.map((item, index) => (
			<li key={index} className={`${item.color} ${selectedClassName(item.active)}`}>
				<MenuItem {...item}/>
			</li>
		))}
	</menu>
)

module.exports = Menu
