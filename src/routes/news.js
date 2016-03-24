import compose from 'koa-compose';
import route from 'koa-route';
import {accepts} from './';
import {c} from '../core/db';
import {sortBy} from '../utils/sort';

const timestamp = i => i.getTime();
const sortNewsByDate = sortBy(
    i => timestamp(new Date(i.date))
);

const redirect = async ctx => ctx.redirect('/');

export default function () {
    return compose([
        news(),
        pinned()
    ]);
};

function news() {
    return route.get('/news', accepts({
        'text/html': redirect,
        'text/plain': redirect,
        'application/json': async ctx => {
            let limit = parseInt(ctx.query['limit']) || 10;
            let skip = parseInt(ctx.query['skip']) || 0;

            let query = {};
            if (ctx.query.type) query.type = ctx.query.type;

            let pinned = [];
            if(skip == 0) {
                const now = new Date();
                pinned = await c('timeline')
                    .find({until: {$gte: now}})
                    .toArray()
                    .then(i => i.sort(sortNewsByDate));
            }

            let sid = id => id + '';
            let pinnedIds = pinned.map(p => sid(p['_id']));

            let posts = await c('timeline')
                .find(query)
                .sort({date: -1})
                .skip(skip)
                .limit(limit)
                .toArray()
                .then(items => items.filter(
                    i => pinnedIds.indexOf(sid(i['_id'])) < 0
                ));

            ctx.body = pinned.concat(posts);
        }
    }));
}

function pinned(){
    return route.get('/news/pinned', accepts({
        'text/html': redirect,
        'text/plain': redirect,
        'application/json': async ctx => {
            let now = new Date();
            ctx.body = await c('timeline')
                .find({until: {$gte: now}})
                .toArray()
                .then(i => i.sort(sortNewsByDate));
        }
    }));
}
