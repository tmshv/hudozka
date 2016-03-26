import {parse} from 'ejson';

export function ejson(type='application/ejson') {
    return async (ctx, next) => {
        let t = ctx.request.headers['content-type'];
        let data = ctx.request.body;

        if (t === type){
            data = typeof data === 'string' ? data : JSON.stringify(data);
            ctx.request.body = parse(data);
        }

        await next();
    };
}
