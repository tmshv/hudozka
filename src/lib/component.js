import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const App = require('../components/App')

function renderApp({menu, component}) {
	const app = (
		<App menu={menu}>
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
