import co from 'co';
import compose from 'koa-compose';
import route from 'koa-route';
import {index, json} from './';
import {sortByPattern} from '../utils/sort';
import {c} from '../core/db';

let split = d => s => s.split(d);
let toArray = split(',');

export default function () {
    return compose([
        collective(),
        list(),
        teacher()
    ]);
};

function collective() {
    return route.get('/collective', index());
}

function list() {
    return route.get('/teacher/list', json(
        async(ctx) => {
            ctx.type = 'application/json';
            let pattern = toArray(ctx.query.sort || '');

            let data = await c('collective').find().toArray();
            if (!data) {
                ctx.status = 404;
                return;
            }

            let collective = await Promise.all(
                data.map(processProfile)
            );

            ctx.body = sortByPattern(collective, pattern, i => i.id);
        }
    ));
}

function teacher() {
    return route.get('/teacher/:id', json(
        async (ctx, id) => {
            ctx.type = 'application/json';

            let data = await c('collective').findOne({id: id});
            if (!data) {
                ctx.status = 404;
                return;
            }

            ctx.body = await processProfile(data);
        }
    ))
}

let processProfile = profile => co(function *() {
    let imageId = profile.picture;
    profile.picture = yield c('images').findOne({_id: imageId});
    profile.url = `/teacher/${profile.id}`;
    return profile;
});