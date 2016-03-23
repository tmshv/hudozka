import {checkAuth} from '../core/service';

export function ensureServiceAuth() {
    return async (ctx, next) => {
        let service = ctx.request.headers['x-service-name'];
        let token = ctx.request.headers['x-service-token'];

        if (!checkAuth(service, token)) {
            ctx.status = 401;
        } else {
            await next();
        }
    };
}
