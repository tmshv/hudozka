import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

import App from '../components/App'

function renderApp({component, ...options}) {
	const app = (
		<App {...options}>
			{component}
		</App>
	)
	return renderToStaticMarkup(app)
}

exports.renderApp = renderApp
