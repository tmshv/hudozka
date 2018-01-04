const React = require('react')
const Image = require('./Image')

const Link = ({href, children}) => (
	<a className="invisible" href={href}>
		{children}
	</a>
)

module.exports = ({picture, name, url, profile}) => (
	<div className="PersonCard">
		<Link href={url}>
			<div className="PersonCard-Picture">
				<Image data={picture}/>
			</div>

			<div className="PersonCard-Title">
				{name[0]} {name[1]} {name[2]}
			</div>

			<div className="PersonCard-Body">
				{profile.position}
			</div>
		</Link>
	</div>
)
