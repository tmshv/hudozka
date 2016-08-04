import {put} from 'koa-route';
import compose from 'koa-compose';
import query from 'koa-query';
import {toBoolean} from 'koa-query';
import {ejson, ensureServiceAuth} from 'hudozka-middlewares';

export function add(auth, data) {
    return put('/timeline', compose([
        ensureServiceAuth(auth),
        ejson(),
        query({
            save: toBoolean()
        }),
        async(ctx) => {
            let doSave = ctx.request.query.save || true;
            let post = ctx.request.body;
            
            try {
                if(!doSave) data.timeline.disableSaving();
                let result = await data.timeline.add(post);
                if(!doSave) data.timeline.enableSaving();

                ctx.body = result;
            } catch (e) {
                ctx.status = 400;
                ctx.body = e;
            }
        }
    ]));
}
