const React = require('react')
const Share = require('./Share')
const getHtml = require('../lib/component').getHtml

const Head = ({url, children}) => (
	!url
		? <h1>{children}</h1>
		: <a href={url}><h2>{children}</h2></a>
)

const TeacherProfile = ({picture, name, url, profile, biography, shareable}) => (
	<div className="teacher-profile">
		<div className="teacher-profile__picture">
			<img src={picture.url}/>
		</div>

		<div className="teacher-profile__info">
			<Head url={url}>
				<span>{name[0]} {name[1]}</span> <strong>{name[2]}</strong>
			</Head>

			<div>
				<p className="teacher-profile__position"><i><strong>{profile.position}</strong></i></p>
				<p>{profile.status}</p>
				<p>Образование: {profile.edu}</p>
				<p>Диплом: <i>{profile.diploma}</i></p>
			</div>

			<div className="teacher-profile__biography">
				{getHtml(biography)}
			</div>
		</div>

		{!shareable ? null : (
			<Share/>
		)}
	</div>
)

module.exports = TeacherProfile
