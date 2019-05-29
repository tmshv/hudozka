import React from 'react'
import Immutable from 'immutable'
import {
	DefaultDraftBlockRenderMap,
	EditorState,
	RichUtils,
	convertFromRaw,
	getDefaultKeyBinding,
	AtomicBlockUtils,
	Modifier
} from 'draft-js'
import DraftEditor, {composeDecorators} from 'draft-js-plugins-editor'

import createImagePlugin from 'draft-js-image-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
// import createDragNDropUploadPlugin from 'draft-js-drag-n-drop-upload-plugin'
import createDndFileUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin'

// import './Draft.less'
import 'draft-js/dist/Draft.css'
import 'draft-js-image-plugin/lib/plugin.css'

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const blockDndPlugin = createBlockDndPlugin()
const alignmentPlugin = createAlignmentPlugin()
const {AlignmentTool} = alignmentPlugin

const decorator = composeDecorators(
	resizeablePlugin.decorator,
	alignmentPlugin.decorator,
	focusPlugin.decorator,
	blockDndPlugin.decorator
)
const imagePlugin = createImagePlugin({decorator})

const dndFileUploadPlugin = createDndFileUploadPlugin({
	handleUpload: console.log,
	addImage: imagePlugin.addImage,
})
// const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
// 	handleUpload: mockUpload,
// 	addImage: imagePlugin.addImage,
// })

const plugins = [
	dndFileUploadPlugin,
	blockDndPlugin,
	focusPlugin,
	alignmentPlugin,
	resizeablePlugin,
	imagePlugin
]

const initialState = {
	'entityMap': {
		'0': {
			'type': 'IMAGE',
			'mutability': 'IMMUTABLE',
			'data': {
				'src': 'https://static.shlisselburg.org/art/images/7c206b4e211bb8486801fd84a3bf309b-big.jpg'
			}
		}
	},
	'blocks': [
		{
			'key': '9gm3s',
			'text': 'You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.',
			'type': 'unstyled',
			'depth': 0,
			'inlineStyleRanges': [],
			'entityRanges': [],
			'data': {}
		},
		{
			'key': 'ov7r',
			'text': ' ',
			'type': 'atomic',
			'depth': 0,
			'inlineStyleRanges': [],
			'entityRanges': [{
				'offset': 0,
				'length': 1,
				'key': 0
			}],
			'data': {}
		},
		{
			'key': 'e23a8',
			'text': 'See advanced examples further down …',
			'type': 'unstyled',
			'depth': 0,
			'inlineStyleRanges': [],
			'entityRanges': [],
			'data': {}
		}
	]
}

class MyCustomBlock extends React.Component {
	// constructor(props) {
	// 	super(props)
	// }

	render() {
		return (
			<div className='MyCustomBlock'>
				{/* here, this.props.children contains a <section> container, as that was the matching element */}
				{this.props.children}
			</div>
		)
	}
}

class MediaComponent extends React.Component {
	render() {
		const {block, contentState} = this.props
		const {foo} = this.props.blockProps
		const data = contentState.getEntity(block.getEntityAt(0)).getData()

		console.log(data)

		return (
			<i>
				{data.text}
				<img src={data.text} alt=""/>
			</i>
		)

		// Return a <figure> or some other content using this data.
	}
}

function blockRendererFn(contentBlock) {
	const type = contentBlock.getType()

	if (type === 'atomic') {
		console.log('blockRendererFn', contentBlock.getKey(), type)

		return {
			component: MediaComponent,
			editable: false,
			props: {
				foo: 'bar',
			},
		}
	} else {
		return null
	}
}

const blockRenderMap = Immutable.Map({
	'section': {
		element: 'section',
		wrapper: MyCustomBlock,
	}
})

// Include 'paragraph' as a valid block and updated the unstyled element but
// keep support for other draft default block types
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap)

export default class Editor extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			editorState: EditorState.createWithContent(convertFromRaw(initialState)),
		}
		this.onChange = this.onChange.bind(this)
		this.onBoldClick = () => {
			this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
		}
		this.focus = () => {
			this.editor.focus()
		}

		this.onZomboClick = () => {
			const contentState = this.state.editorState.getCurrentContent();
			const contentStateWithEntity = contentState.createEntity(
				'LINK',
				'MUTABLE',
				{url: 'http://www.zombo.com'}
			)
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const contentStateWithLink = Modifier.applyEntity(
				contentStateWithEntity,
				selectionState,
				entityKey
			)
			this.onChange(contentStateWithLink);

			// this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
		}

		this.handleKeyCommand = this.handleKeyCommand.bind(this)
		this.keyBindingFn = this.keyBindingFn.bind(this)
		this.insertBlock = this.insertBlock.bind(this)
	}

	insertBlock(type, data) {
		const {editorState} = this.state
		const contentState = editorState.getCurrentContent()
		const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data)
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

		const newEditorState = EditorState.set(editorState, {
			currentContent: contentStateWithEntity
		})

		this.setState({
			editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
		})
	}

	onChange(editorState) {
		const content = editorState.getCurrentContent()
		const s = editorState.getSelection()

		const key = s.getStartKey()
		const prevKey = content.getKeyBefore(key)

		const block = content.getBlockForKey(key)
		const prevBlock = content.getBlockForKey(prevKey)

		const text = block.getText()
		if (/\.jpg/.test(text)) {
			this.insertBlock('jpg', {text})
			// const newContent = Modifier.setBlockType(content, s, 'atomic')
			//
			// const newEditorState = EditorState.set(editorState, {
			// 	currentContent: newContent,
			// })
			//
			// this.setState({
			// 	editorState: newEditorState,
			// })
		} else {
			this.setState({editorState})
		}

		// const blockData = block.getData()

		// console.log(block.getText(), block.getType())

		// console.log(block.getEntityAt(0))
	}

	keyBindingFn(e) {
		// console.log("K", e.key)

		// if (e.key === 'Enter') {
		// 	return 'enter'
		// }
		return getDefaultKeyBinding(e)
	}

	handleKeyCommand(command) {
		console.log('CMD', command)
		const newState = RichUtils.handleKeyCommand(this.state.editorState, command)

		if (newState) {
			this.onChange(newState)
			return 'handled'
		}

		return 'not-handled'
	}

	render() {
		const content = this.state.editorState.getCurrentContent()
		const e = this.state.editorState

		const s = e.getSelection()
		const key = s.getStartKey()
		const so = s.getStartOffset()
		const block = content.getBlockForKey(key)

		return (
			<div>
				<DraftEditor
					editorState={this.state.editorState}
					onChange={this.onChange}
					blockRendererFn={blockRendererFn}
					blockRenderMap={extendedBlockRenderMap}
					handleKeyCommand={this.handleKeyCommand}
					keyBindingFn={this.keyBindingFn}
					plugins={plugins}
					ref={(element) => {
						this.editor = element
					}}
				/>
				{/* <AlignmentTool/> */}
				<button onClick={this.onBoldClick}>Bold</button>

				<div>
					<p>
						block key: {key} type: {block.getType()}
					</p>
					<p>
						start offset {so}
					</p>
					<pre>
						{content.getPlainText('\n')}
					</pre>
				</div>
			</div>
		)
	}
}
