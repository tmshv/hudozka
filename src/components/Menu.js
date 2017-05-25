const React = require('react')
const getPathWithNoTrailingSlas = require('../lib/url').getPathWithNoTrailingSlash

const hasSubmenu = item => !!item.items
const doDrawSubmenu = item => false //item.active && hasSubmenu(item)
const itemUrl = url => getPathWithNoTrailingSlas(url)

const selectedClassName = flag => flag
	? 'selected'
	: ''

const MenuItem = ({active, text, url}) => (active
		? <span>{text}</span>
		: <a href={itemUrl(url)}>{text}</a>
)

const Menu = ({items}) => {
	const content = items.map((item, index) => (
		<li key={index}
			className={`${item.color} ${selectedClassName(item.highlighted)}`}
		>
			<MenuItem {...item}/>
			{!doDrawSubmenu(item) ? null :
				<Submenu key={index} items={item.items}/>
			}
		</li>
	))
	return (
		<menu className="main-menu">{content}</menu>
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