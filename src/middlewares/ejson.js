import {parse} from 'ejson';

export function ejson() {
    return async (ctx, next) => {
        let type = ctx.request.headers['content-type'];
        let data = ctx.request.body;

        if (type === 'application/ejson'){
            data = typeof data === 'string' ? data : JSON.stringify(data);
            ctx.request.body = parse(data);
        }

        await next();
    };
}
