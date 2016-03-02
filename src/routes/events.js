import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';
import {sortBy} from '../utils/sort';

export default function (app) {
    let sortByDate = sortBy(
        i => (new Date(i.date))
            .getTime()
    );

    app.use(route.get('/events', json(
        function *() {
            let query = {};
            let events = yield c('events')
                .find(query)
                .toArray();

            this.body = events
                .sort(sortByDate);
        }
    )));

    app.use(route.get('/event/:event', json(
        function *(event) {
            this.body = yield c('events').findOne({id: event});
        }
    )));
};
