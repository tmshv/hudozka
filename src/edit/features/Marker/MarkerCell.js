import React, {Component} from 'react'
import className from 'classnames'
import {trimNewline} from './lib/fn'

import './Marker.less'
import {MarkerEdit} from './MarkerEdit'

const Cell = ({children, active = false, edit = false}) => (
	<div className={className('MarkerCell', {
		'MarkerCell--active': active,
		'MarkerCell--edit': edit,
	})}>
		{children}
	</div>
)

export class MarkerCell extends Component {
	constructor(props) {
		super(props)

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)

		this.state = {
			content: null,
		}
	}

	getCellData() {
		return this.state.content
			? this.state.content
			: this.props.cell.data
	}

	getCellComponent() {
		return this.props.cell.render()
	}

	onSubmit(e) {
		e.preventDefault()
		const {onUpdate} = this.props
		onUpdate(this.getCellData())
	}

	onChange(e) {
		const content = trimNewline(e.target.value)

		this.setState({
			content,
		})
	}

	render() {
		const {active, edit} = this.props

		return edit
			? (
				<Cell edit={edit}>
					<MarkerEdit
						onSubmit={this.onSubmit}
						onChange={this.onChange}
					>
						{this.getCellData()}
					</MarkerEdit>
				</Cell>
			) : (
				<Cell active={active}>
					{this.getCellComponent()}
				</Cell>
			)
	}
}
