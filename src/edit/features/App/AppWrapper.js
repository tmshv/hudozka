import React, {Component} from 'react'
import {Link} from 'react-router'

import './AppWrapper.css'
import './AppWrapperHeader.css'
import './AppWrapperBody.css'
import './AppWrapperContent.css'
import './Icon.css'

const Icon = ({children: iconName}) => (
	<span className={`Icon ${iconName}`}/>
)

class Toggle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: true
		}
	}

	onClick = () => {
		const {value} = this.state
		const {onClick} = this.props

		this.setState({
			value: !value,
		})
		onClick(!value)
	}

	render() {
		const {value} = this.state
		const icon = value
			? 'IconFullScreenOn'
			: 'IconFullScreenOff'

		return (
			<button className="InvisibleButton" onClick={this.onClick}>
				<Icon>{icon}</Icon>
			</button>
		)
	}
}

const Head = ({title, onToggleFullPage, showFullPageToggle, showControls = false}) => (
	<header className="AppWrapperHeader">
		<div>
		</div>

		<div className="AppWrapperHeader-main">
			<h1>{title}</h1>
		</div>

		<div>
			{!showControls ? null : (
				<div className="controls">
					{!showFullPageToggle ? null: (
						<Toggle onClick={onToggleFullPage}/>
					)}
				</div>
			)}
		</div>
	</header>
)

const Body = ({children}) => (
	<div className="AppWrapperBody">
		<div className="AppWrapperContent">
			{children}
		</div>
	</div>
)

const AppWrapper = ({title, children, showControls, showFullPageToggle, onToggleFullPage}) => (
	<div className="AppWrapper">
		<Head
			title={title}
			showControls={showControls}
			onToggleFullPage={onToggleFullPage}
			showFullPageToggle={showFullPageToggle}
		/>

		<Body>{children}</Body>
	</div>
)

export default AppWrapper
