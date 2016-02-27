import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';

export default function (app) {
    app.use(route.get('/events', json(
        function *() {
            let query = {};
            this.body = yield c('events')
                .find(query)
                .toArray();
        }
    )));

    app.use(route.get('/event/:event', json(
        function *(event) {
            this.body = yield c('events').findOne({id: event});
        }
    )));
};
