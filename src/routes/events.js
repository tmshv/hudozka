import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';
import {sortBy} from '../utils/sort';

export default function (app) {
    let sortByDate = sortBy(
        i => (new Date(i.date))
            .getTime()
    );

    app.use(route.get('/events/:page?', json(
        function *() {
            let limit = parseInt(this.query['limit']) || 10;
            let skip = parseInt(this.query['skip']) || 0;

            let query = {};
            let documents = yield c('events')
                .find(query)
                .sort({date: -1})
                .skip(skip)
                .limit(limit)
                .toArray();

            let total = yield c('events')
                .find(query).count();

            this.body = {
                skip: skip,
                limit: limit,
                total: total,
                data: documents
            };
        }
    )));
};
