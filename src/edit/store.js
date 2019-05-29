import {createStore, applyMiddleware, compose} from 'redux'
// import thunk from 'redux-thunk'
// import async from '../lib/promiseMiddleware'
// import createEffects from '../lib/sideEffectsMiddleware'

// import {routerMiddleware} from 'react-router-redux'
// import {browserHistory} from 'react-router'

export function create(reducer, init, enhancers = [], effects = []) {
	// const browser = routerMiddleware(browserHistory)
	// const es = createEffects(effects)
	// const enhancer = compose(applyMiddleware(browser, async, thunk, es), ...enhancers)
	const enhancer = compose(applyMiddleware(), ...enhancers)
	return createStore(reducer, init, enhancer)
}
