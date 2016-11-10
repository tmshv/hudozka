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
            const limit = parseInt(ctx.query['limit']) || 20;
            const skip = parseInt(ctx.query['skip']) || 0;

            const query = {};
            if (ctx.query.type) query.type = ctx.query.type;

            const now = new Date();
            const pinned = skip != 0 ? [] : await c('timeline')
                .find({until: {$gte: now}})
                .toArray();

            const id = i => i._id;
            const pinnedIds = pinned.map(id);

            let posts = await c('timeline')
                .find(query)
                .sort({date: -1})
                .skip(skip)
                .limit(limit)
                .toArray();

            ctx.body = [
                ...pinned.sort(sortNewsByDate),
                ...posts.filter(
                    i => !pinnedIds.includes(id(i))
                )
            ];
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
