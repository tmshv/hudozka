import compose from 'koa-compose';
import {get} from './';
import {ensureAuth} from './auth';

export function list() {
    return compose([
        ensureAuth(),
        get('/subscriptions', async(ctx) => {
            const instagram = ctx.instagram;

            ctx.set('Content-Type', 'application/json');
            ctx.body = await instagram.subscriptions.list();
        })
    ]);
}

export function addTag() {
    return compose([
        ensureAuth(),
        get('/subscriptions/add-tag/:tag', async(ctx, tag) => {
            let callbackUrl = ctx.query.url;
            let result = await ctx.instagram.subscriptions.subscribeTag(tag, callbackUrl);
            if (result) {
                ctx.body = result;
            } else {
                ctx.status = 500;
            }
        })
    ]);
}

export function addUser() {
    return compose([
        ensureAuth(),
        get('/subscriptions/add-user', async (ctx) => {
            let callbackUrl = ctx.query.url;
            let result = await ctx.instagram.subscriptions.subscribeUser(callbackUrl);
            if (result) {
                ctx.body = result;
            } else {
                ctx.status = 500;
            }
        })
    ])
}

// export function remove() {
//     return get('/subscriptions/remove/:id', async (ctx, id) => {
//         let result = yield instagram.api.unsubscribe(id);
//         if(result) {
//             ctx.body = result;
//         }else{
//             ctx.status = 500;
//         }
//     });
// }
