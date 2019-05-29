import React, {Component, createContext} from 'react'

import './Marker.less'

export class MarkerTabIndex extends Component {
	constructor(props) {
		super(props)

		this.onFocus = this.onFocus.bind(this)
		this.onRef = this.onRef.bind(this)
	}

	onFocus() {
		const {onFocus, data} = this.props
		onFocus(data)
	}

	onRef(e) {
		this.element = e
	}

	componentDidUpdate() {
		const {focus} = this.props
		if (focus) {
			this.element.focus()
		}
	}

	render() {
		const {tabIndex, children} = this.props

		return (
			<div
				className={'MarkerCellTabIndex'}
				children={children}
				tabIndex={tabIndex}
				onFocus={this.onFocus}
				ref={this.onRef}
				role={'button'}
			/>
		)
	}
}
