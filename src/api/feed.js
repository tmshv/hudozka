import {put} from 'koa-route';
import compose from 'koa-compose';
import {ensureServiceAuth} from '../middlewares/ensureServiceAuth';

import data from '../data';

export function add() {
    return put('/api/v1/feed', compose([
        ensureServiceAuth(),
        async(ctx) => {
            let post = ctx.request.body;
            
            try {
                ctx.body = await data.feed.add(post);
            } catch (e) {
                ctx.status = 400;
                ctx.body = e;
            }
        }
    ]));
}
