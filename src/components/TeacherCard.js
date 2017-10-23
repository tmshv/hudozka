const React = require('react')
const Image = require('./Image')

const Head = ({url, children}) => (
	<h2>
		<a href={url}>{children}</a>
	</h2>
)

const Info = ({children}) => (
	<div className="Article Article--cloud">
		<div className="Article-Body">
			{children}
		</div>
	</div>
)

module.exports = ({picture, name, url, profile}) => (
	<div className="TeacherCard">
		<div className="TeacherCard-Picture">
			<Image data={picture}/>
		</div>

		<div className="TeacherCard-Info">
			<Head url={url}>
				<span>{name[0]} {name[1]}</span> <strong>{name[2]}</strong>
			</Head>

			<Info>
				<p className="TeacherCard-Position"><i><strong>{profile.position}</strong></i></p>
				<p>{profile.status}</p>
				<p>Образование: {profile.edu}</p>
				<p>Диплом: <i>{profile.diploma}</i></p>
			</Info>
		</div>
	</div>
)
