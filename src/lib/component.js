import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const App = require('../components/App')

function renderApp({component, ...options}) {
	const app = (
		<App {...options}>
			{component}
		</App>
	)
	return renderToStaticMarkup(app)
}

function getHtml(html) {
	return (
		<div dangerouslySetInnerHTML={{__html: html}}/>
	)
}

exports.renderApp = renderApp
exports.getHtml = getHtml
