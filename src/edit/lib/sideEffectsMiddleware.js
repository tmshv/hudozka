export default function createEffects(effects) {
	return store => next => action => {
		next(action)
		effects.forEach(effect => effect(store.getState(), action, store.dispatch))
	}
}
