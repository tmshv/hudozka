import {put} from 'koa-route';
import compose from 'koa-compose';
import {ensureServiceAuth} from '../middlewares/ensureServiceAuth';
import {ejson} from '../middlewares/ejson';
import query from 'koa-query';
import {toBoolean} from 'koa-query';

export function add(auth, store) {
    return put('/timeline', compose([
        ensureServiceAuth(),
        ejson(),
        query({
            save: toBoolean()
        }),
        async(ctx) => {
            let doSave = ctx.request.query.save || true;
            let post = ctx.request.body;
            
            try {
                if(!doSave) store.timeline.disableSaving();
                let result = await store.timeline.add(post);
                if(!doSave) store.timeline.enableSaving();
                
                ctx.body = result;
            } catch (e) {
                ctx.status = 400;
                ctx.body = e;
            }
        }
    ]));
}
