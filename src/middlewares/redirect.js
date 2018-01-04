/**
 *
 * @param redirectMap
 * [{String url, String redirect}, ...]
 * @returns {*}
 */
function redirect(redirectMap) {
	return async (ctx, next) => {
		const path = ctx.request.path

		if (redirectMap.has(path)) {
			const url = redirectMap.get(path)
			ctx.redirect(url)
		} else {
			await next()
		}
	}
}

module.exports = redirect
