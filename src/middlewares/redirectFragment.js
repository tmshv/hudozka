function redirectFragment() {
	return async (ctx, next) => {
		const query = ctx.query

		console.log(query)

		if ('_escaped_fragment_' in query) {
			ctx.redirect(ctx.path)
		} else {
			await next()
		}
	}
}

module.exports = redirectFragment
