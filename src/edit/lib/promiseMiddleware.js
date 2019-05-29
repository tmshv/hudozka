import {actionRequest, actionFailure} from './action'

export default function promiseMiddleware() {
	return next => action => {
		const {async, type, ...rest} = action
		if (!async) return next(action)

		next({...rest, type: actionRequest(type)})
		return async
			.then(res => {
				next({...rest, ...res, error: null, type})
				return true
			})
			.catch(error => {
				next({...rest, error, type: actionFailure(type)})
				return false
			})
	}
}
