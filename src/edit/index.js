import React from 'react'
import App from './features/App'

// import {createDevTools} from 'redux-devtools'
// import LogMonitor from 'redux-devtools-log-monitor'
// import DockMonitor from 'redux-devtools-dock-monitor'

import {Provider} from 'react-redux'
import reducer from './reducers'
import effects from './effects'

import {create} from './store'

import {Router, Route, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

const initialState = {}

// const DevTools = createDevTools(
// 	<DockMonitor defaultIsVisible={false}
// 				 toggleVisibilityKey="ctrl-h"
// 				 changePositionKey="ctrl-q"
// 	>
// 		<LogMonitor theme="tomorrow" preserveScrollTop={false}/>
// 	</DockMonitor>
// )

const store = create(reducer, initialState, [
	// DevTools.instrument()
], effects())
// const history = syncHistoryWithStore(browserHistory, store)

export default function (marker, data) {
	// return (
	// 	<App/>
	// )

	return (
		<Provider store={store}>
			<div>
				<App
					marker={marker}
					data={data}
				/>
				{/*<Router history={history}>*/}
					{/*<Route path="/edit" component={App}>*/}

					{/*</Route>*/}
				{/*</Router>*/}

				{/*<DevTools/>*/}
			</div>
		</Provider>
	)
}
