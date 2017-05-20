const React = require('react')

const hasSubmenu = item => !!item.items
const doDrawSubmenu = item => false //item.active && hasSubmenu(item)

const selectedClassName = active => active
	? 'selected'
	: ''

const MenuItem = ({active, text, url}) => (active
		? <span>{text}</span>
		: <a href={url}>{text}</a>
)

const Menu = ({items}) => {
	const content = items.map((item, index) => (
		<li key={index} className={`${item.color} ${selectedClassName(item.active)}`}>
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
