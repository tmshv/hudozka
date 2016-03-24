import {get, post} from './';
import update from '../core/update';

export function callbackGet() {
    return get('/callback/:id', async (ctx, id) => {
        console.log('challenge', id);

        if(ctx.query['hub.mode'] == 'subscribe'){
            ctx.body = ctx.query['hub.challenge'];
        }else{
            ctx.status = 400;
        }
    });
}

export function callbackPost() {
    return post('/callback/:id', async (ctx, id) => {
        let body = ctx.request.body;
        console.log(id, body);
        update(id, body);

        ctx.status = 200;
        ctx.body = '';

        //body example
        // {
        //     "changed_aspect": "media",
        //     "object": "tag",
        //     "object_id": "love",
        //     "time": 1458675620,
        //     "subscription_id": 22487204,
        //     "data": {}
        // }
        
        // let sign = ctx.header['x-hub-signature'];
        //var hmac = crypto.createHmac("sha1", instagram.client_secret);
        //hmac.update(body);
        //var shasum = hmac.digest("hex");

        //console.log("X-Hub-Signature", sign);
        //console.log("Hmac", shasum);
        //console.log();

        //if(shasum.digest("hex") == sign) {
        // instagram.update(body);
        //}
    });
}
