import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';
import {sortBy} from '../utils/sort';

let sortByDate = sortBy(
    i => (new Date(i.date))
        .getTime()
);

export default function () {
    return route.get('/events/:page?', json(
        async(ctx) => {
            let limit = parseInt(ctx.query['limit']) || 10;
            let skip = parseInt(ctx.query['skip']) || 0;

            let query = {};
            let documents = await c('events')
                .find(query)
                .sort({date: -1})
                .skip(skip)
                .limit(limit)
                .toArray();

            let total = await c('events')
                .find(query).count();

            ctx.body = {
                skip: skip,
                limit: limit,
                total: total,
                data: documents
            };
        }
    ));
};
