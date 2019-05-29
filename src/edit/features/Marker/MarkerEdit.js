import React, {Component, createContext} from 'react'
import className from 'classnames'
import {trim} from './lib/fn'
import {MarkerContext} from './Marker'

import './Marker.less'
import ContentEditable from './ContentEditable'

export class MarkerEdit extends Component {
	constructor(props) {
		super(props)

		// this.onInputRef = this.onInputRef.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onFocus = this.onFocus.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
	}

	onChange(event) {
		console.log(event, event.target)
		this.props.onChange(event)
	}

	onFocus(e) {
		e.stopPropagation()
	}

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp': {
				if (event.shiftKey) return
				event.stopPropagation()
				break
			}

			case 'ArrowDown': {
				if (event.shiftKey) return
				event.stopPropagation()
				break
			}

			case 'Enter': {
				console.log('MarkerEdit Enter')
				if (event.shiftKey) return
				// event.stopPropagation()

				const {onSubmit} = this.props
				onSubmit(event)
			}
		}
	}

	// onInputRef(e) {
	// 	this.input = e
	// }
	//
	// componentDidMount() {
	// 	this.input.focus()
	// }

	render() {
		const {children} = this.props

		return (
			<ContentEditable
				// ref={this.onInputRef}
				onChange={this.onChange}
				onFocus={this.onFocus}
				onKeyDown={this.onKeyDown}
			>
				{children}
			</ContentEditable>
		)

		// return (
		// 	<textarea
		// 		value={children}
		// 		ref={this.onInputRef}
		// 		onChange={onChange}
		// 		onFocus={this.onFocus}
		// 		onKeyDown={this.onKeyDown}
		// 	/>
		// )
	}
}
