import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const App = require('../components/App')
const Html = require('../components/Html')

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
        <Html
            html={html}
        />
	)
}

exports.renderApp = renderApp
exports.getHtml = getHtml
