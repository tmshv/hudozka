import {put} from 'koa-route';
import compose from 'koa-compose';
import {ensureServiceAuth} from '../../middlewares/ensureServiceAuth';

export function add() {
    return put('/api/v1/feed', compose([
        ensureServiceAuth(),
        async ctx => {
            let post = ctx.body;
            ctx.body = {
                pong: post
            };
        }
    ]));
}
