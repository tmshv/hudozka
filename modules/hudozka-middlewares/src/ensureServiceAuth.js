// auth - fn that returns boolean
export function ensureServiceAuth(auth) {
    return async (ctx, next) => {
        let service = ctx.request.headers['x-service-name'];
        let token = ctx.request.headers['x-service-token'];

        if (!auth(service, token)) {
            ctx.status = 401;
        } else {
            await next();
        }
    };
}

