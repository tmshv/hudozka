import React, {Component} from 'react'
import Marker from '../Marker'
import './App.less'
import {MarkerWidgetHtml, MarkerWidgetText, MarkerWidgetUrl} from '../Marker/MarkerWidget'
import ContentEditable from '../Marker/ContentEditable'
import Editor from '../Editor/'

// import Map from '../Map'
// import Body from '../Body'
// import AppWrapper from './AppWrapper'
//
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
// import * as actions from './duck'
//
// import {routerActions} from 'react-router-redux'
// import {title as defaultTitle} from '../../../config'
// import {getVariable} from '../../../lib/style'
// import {debounce} from '../../../lib/fn'
// const hit = debounce(50, path => ym('hit', path))
//
// const projectPath = project => `/projects/${project.name}`
// const frameSize = isVertical => [window.innerWidth, window.innerHeight]
// const frameSizeMultiplier = () => getVariable('--content-width-state-normal')
// const landscapeProjectBounds = (width, height, ratio=frameSizeMultiplier()) => [
// 	[0, 0],
// 	[width * ratio, 0],
// ]
// const portraitProjectBounds = (width, height, ratio=frameSizeMultiplier()) => [
// 	[0, 0],
// 	[0, width * ratio],
// ]
//
// function mapStateToProps(state) {
// 	const {fullPage, isVertical, halfPageAvailable} = state.app.page
//
// 	return {
// 		projects: state.app.projects.items,
// 		activeProject: state.app.projects.activeProject,
// 		fullPage: halfPageAvailable
// 			? fullPage
// 			: true,
// 		showFullPageToggle: halfPageAvailable,
// 		isVertical,
// 	}
// }
//
// function mapDispatchToProps(dispatch) {
// 	return bindActionCreators({
// 		...actions,
// 		push: routerActions.push
// 	}, dispatch)
// }

// async function build_document(data) {
// 	// text = data['caption'] if data['caption'] else data['file']
// 	//    # document = await self.build()
// 	document = {
// 		'url': data['file'],
// 		'image_url': data['file'],
// 		'file_url': data['file'],
// 		'title': text,
// 		'file_size': '0 KB',
// 		'file_format': 'PDF',
// 	}
// 	return document
// }

// async function read_csv(data) {
// 	return '\n'.join([
// 		'N,Name',
// 		`0,${data}`,
// 		'1,Pop',
// 		'2,Top',
// 	])
// }

// async function read_document(data) {
// 	const doc = await Document.find_one({'id': data})
// 	return {
// 		'url': doc['url'],
// 		'image_url': doc['url'],
// 		'file_url': doc['url'],
// 		'title': doc['title'],
// 		'file_size': '0 KB',
// 		'file_format': 'PDF',
// 	}
// }

export default class App extends Component {
	constructor(props) {
		super(props)

		this.onMarkerUpdate = this.onMarkerUpdate.bind(this)

		this.state = {
			tokens: [],
		}
	}

	onMarkerUpdate(tokens) {
		// console.log('Update')
		// console.log(tokens)

		this.setState({tokens})
	}

	componentWillMount() {
		const {data, marker} = this.props

		marker.evaluate(data)
			.then(tokens => {
				this.setState({
					tokens,
				})
			})

		// this.setState({
		// 	data: this
		// 		.getData()
		// 		.reduce((acc, x) => [...acc, ...x], []),
		// })
	}

	render() {
		return (
			<div className="App">
				<div className={'App-Body'}>
					<Editor/>
					{/* <Marker */}
						{/* data={this.state.tokens} */}
						{/* marker={this.props.marker} */}
						{/* onUpdate={this.onMarkerUpdate} */}
					{/* /> */}
				</div>
			</div>
		)
	}
}

// export default connect(mapStateToProps, mapDispatchToProps)(App)
