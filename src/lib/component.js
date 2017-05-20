import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const App = require('../components/App')

function renderApp({menu, page}) {
	const app = (
		<App menu={menu}>
			<div dangerouslySetInnerHTML={{__html: page.data}}/>
		</App>
	)
	return renderToStaticMarkup(app)
}

exports.renderApp = renderApp
