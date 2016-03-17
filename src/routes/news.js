import route from 'koa-route';
import {accepts, index} from './';
import {c} from '../core/db';
import {sortBy} from '../utils/sort';

export default function (app) {
    let sortNewsByDate = sortBy(
        i => (new Date(i.date))
            .getTime()
    );

    app.use(route.get('/news', accepts({
        'text/html': function *() {
            this.redirect('/');
        },
        'text/plain': function *() {
            this.redirect('/');
        },
        'application/json': function *() {
            let limit = parseInt(this.query['limit']) || 10;
            let skip = parseInt(this.query['skip']) || 0;

            let query = {};
            if (this.query.type) query.type = this.query.type;

            let pinned = [];
            if(skip == 0) {
                const now = new Date();
                pinned = yield c('timeline')
                    .find({until: {$gte: now}})
                    .toArray()
                    .then(i => i.sort(sortNewsByDate));
            }

            let sid = id => id + '';
            let pinnedIds = pinned.map(p => sid(p['_id']));

            let posts = yield c('timeline')
                .find(query)
                .sort({date: -1})
                .skip(skip)
                .limit(limit)
                .toArray()
                .then(items => items.filter(
                    i => pinnedIds.indexOf(sid(i['_id'])) < 0
                ));

            this.body = pinned.concat(posts);
        }
    })));

    app.use(route.get('/news/pinned', accepts({
        'text/html': function *() {
            this.redirect('/');
        },
        'text/plain': function *() {
            this.redirect('/');
        },
        'application/json': function *() {
            let now = new Date();
            this.body = yield c('timeline')
                .find({until: {$gte: now}})
                .toArray()
                .then(i => i.sort(sortNewsByDate));
        }
    })));
};
