import {put} from 'koa-route';
import compose from 'koa-compose';
import {ensureServiceAuth} from '../middlewares/ensureServiceAuth';
import {ejson} from '../middlewares/ejson';
import {queryValue, booleanify} from '../middlewares/queryValue';

import data from '../data';

export function add() {
    return put('/api/v1/feed', compose([
        ensureServiceAuth(),
        ejson(),
        queryValue({
            save: booleanify()
        }),
        async(ctx) => {
            let doSave = ctx.request.query.save || true;
            let post = ctx.request.body;
            
            try {
                if(!doSave) data.feed.disableSaving();
                ctx.body = await data.feed.add(post);
                if(!doSave) data.feed.enableSaving();
            } catch (e) {
                ctx.status = 400;
                ctx.body = e;
            }
        }
    ]));
}
