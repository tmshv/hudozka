import React, {Component} from 'react'
import {MarkerTabIndex} from './MarkerTabIndex'
import {MarkerCell} from './MarkerCell'

import './Marker.less'
import {exist} from '../../lib/fn'
import ContentEditable from './ContentEditable'
import {constrain} from "./lib/fn";

export class Marker extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentCellIndex: 0,
		}

		this.onCellUpdate = this.onCellUpdate.bind(this)
		this.onCellSelect = this.onCellSelect.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
	}

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp': {
				console.log('Marker ArrowUp')

				this.setState({
					currentCellIndex: this.getPrevCellIndex(),
				})
				break
			}

			case 'ArrowDown': {
				console.log('Marker ArrowDown')

				this.setState({
					currentCellIndex: this.getNextCellIndex(),
				})
				break
			}

			case 'Enter': {
				console.log('Marker Enter')

				const s = getSelection()
				console.log(s, s.getRangeAt(0))

				event.preventDefault()

				// if (!event.shiftKey) return
				// event.stopPropagation()

				return this.handleEnter()
			}
		}
	};

	getCellIndex(n) {
		const {data} = this.props
		const {currentCellIndex} = this.state
		const index = currentCellIndex + n

		return constrain(index, 0, data.length - 1)
	}

	getPrevCellIndex(...args) {
		return this.getCellIndex(-1, ...args)
	}

	getNextCellIndex(...args) {
		return this.getCellIndex(1, ...args)
	}

	onCellSelect(index) {
		this.setState({
			currentCellIndex: index,
		})
	}

	getDataAt(index) {
		return this.props.data[index]
	}

	getBlankTextAt(index) {
		if (index === 0) return ''

		const cellBefore = this.getDataAt(index)
		const textBefore = cellBefore.data

		let text

		const ol = (text) => {
			const m = /^(\d+)\.\s/.exec(text)
			if (m) {
				const d = parseFloat(m[1])
				return `${d + 1}.`
			} else {
				return null
			}
		}

		const ul = (text) => /^-\s/.test(text)
			? '- '
			: null

		text = ol(textBefore)
		if (text) return text

		text = ul(textBefore)
		if (text) return text

		return ''
	}

	async handleEnter() {
		const {currentCellIndex} = this.state
		const currentCell = this.getDataAt(currentCellIndex)

		if (currentCell.data) {
			const nextCellIndex = currentCellIndex + 1

			if (nextCellIndex > this.props.data.length - 1) {
				const {data, marker, onUpdate} = this.props
				const blankText = this.getBlankTextAt(currentCellIndex)
				const newCell = await marker.blank({text: blankText})
				const newData = [
					...data,
					newCell,
				]

				onUpdate(newData)
			} else {

			}

			this.setState({
				currentCellIndex: nextCellIndex,
			})
		}
	}

	async onCellUpdate(index, text) {
		console.log('UPDATE', text)

		const {data, marker, onUpdate} = this.props

		const cells = await marker.evaluate(text)

		const before = data.slice(0, index)
		const after = data.slice(index + 1)

		let newData = [
			...before,
			...cells,
			...after,
		]

		// const next = index + cells.length
		// if (next > newData.length - 1) {
		// 	const newCell = await marker.blank()
		// 	newData.push(newCell)
		// }

		console.log(newData.map(x => x.data).join('\n'))

		onUpdate(newData)
	}

	componentWillMount() {
		// this.setState({
		// 	currentCellIndex: 0,
		// })
	}

	render() {
		const {data} = this.props
		if (!data.length) return null

		const {currentCellIndex} = this.state

		const tabIndex = 1
		return (
			<div
				className='Marker'
				// onKeyDownCapture={this.onKeyDown}
				onKeyDown={this.onKeyDown}
			>
				{data.map((x, i) => {
					return (i === currentCellIndex ? (
							<ContentEditable
								mix={'MarkerCell'}
								tabIndex={tabIndex + i}
								key={i}
								onChange={text => this.onCellUpdate(i, text)}
							>
								{x.data}
							</ContentEditable>
						) : (
							<div
								className={'MarkerCell'}
								tabIndex={tabIndex + i}
								key={i}
								onFocus={() => this.onCellSelect(i)}
							>
								{x.render()}
							</div>
						)
					)
				})}
			</div>
		)
	}
}
