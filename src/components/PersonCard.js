const React = require('react')
const Image = require('./Image')

const Link = ({href, children}) => (
	<a className="invisible" href={href}>
		{children}
	</a>
)

const Info = ({children}) => (
	<div className="Article Article--cloud">
		<div className="Article-Body">
			{children}
		</div>
	</div>
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

				{/*<Info>*/}
				{/*<p className="PersonCard-Position"><i><strong>{profile.position}</strong></i></p>*/}
				{/*<p>{profile.status}</p>*/}
				{/*<p>Образование: {profile.edu}</p>*/}
				{/*<p>Диплом: <i>{profile.diploma}</i></p>*/}
				{/*</Info>*/}
			</div>
		</Link>
	</div>
)
