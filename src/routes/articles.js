import route from 'koa-route';
import {c} from '../core/db';
import {accepts, index} from './';

async function exists(ctx, id) {
    let i = await article(id);
    return i ? true : false;
}

async function article(id){
    let i = await c('events').findOne({id: id});
    if (!i) {
        i = await c('timeline').findOne({id: id});
    }
    return i;
}

export default function () {
    return route.get('/article/:id', accepts({
        'text/html': index(exists),
        'text/plain': index(exists),
        'application/json': async (ctx, id) => {
            let i = await article(id);
            if (!i) ctx.status = 404;
            else  ctx.body = i;
        }
    }))
};
