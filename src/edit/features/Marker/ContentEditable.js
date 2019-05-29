import React, {Component} from 'react'

export default class ContentEditable extends Component {
	constructor(props) {
		super(props)

		this.emitChange = this.emitChange.bind(this)
		this.onRef = this.onRef.bind(this)
	}

	getHtml() {
		return this.props.children
	}

	onRef(element) {
		this.htmlEl = element
	}

	emitChange() {
		if (!this.htmlEl) return
		const html = this.htmlEl.innerHTML

		if (html !== this.lastHtml) this.props.onChange(html)
		this.lastHtml = html
	}

	componentDidMount() {
		this.htmlEl.focus()
	}

	shouldComponentUpdate(nextProps) {
		let {props, htmlEl} = this

		// We need not rerender if the change of props simply reflects the user's edits.
		// Rerendering in this case would make the cursor/caret jump

		// Rerender if there is no element yet... (somehow?)
		if (!this.htmlEl) return true

		// // ...or if html really changed... (programmatically, not by user edit)
		// if (nextProps.html !== htmlEl.innerHTML && nextProps.html !== props.html) {
		// 	return true
		// }

		return false

		// let optional = ['style', 'className', 'disabled', 'tagName']
		//
		// // Handle additional properties
		// return optional.some(name => props[name] !== nextProps[name])
	}

	componentDidUpdate() {
		const html = this.getHtml()
		if (this.htmlEl && this.htmlEl.innerHTML !== html) {
			// Perhaps React (whose VDOM gets outdated because we often prevent
			// rerendering) did not update the DOM. So we update it manually now.
			this.htmlEl.innerHTML = html
		}
	}

	render() {
		const {mix} = this.props;

		return <div
			className={mix}
			ref={this.onRef}
			onInput={this.emitChange}
			onChange={this.emitChange}
			// onBlur={this.props.onBlur || this.emitChange}
			contentEditable={true}
			suppressContentEditableWarning={true}
			// dangerouslySetInnerHTML={{__html: this.getHtml()}}
		>
			{this.getHtml()}
		</div>
	}
}
