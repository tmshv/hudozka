import co from 'co';
import route from 'koa-route';
import {index, json} from './';
import {sortByPattern} from '../utils/sort';
import {c} from '../core/db';

let split = d => s => s.split(d);
let toArray = split(',');

export default function (app) {
    app.use(route.get('/collective', index()));

    app.use(route.get('/teacher/list', json(
        function *() {
            this.type = 'application/json';
            let pattern = toArray(this.query.sort || '');

            let data = yield c('collective').find();
            if (!data) {
                this.status = 404;
                return;
            }

            let collective = yield data
                .map(processProfile);

            this.body = sortByPattern(collective, pattern, i => i.id);
        }
    )));

    app.use(route.get('/teacher/:id', json(
        function *(id) {
            this.type = 'application/json';

            let data = yield c('collective').findOne({id: id});
            if (!data) {
                this.status = 404;
                return;
            }

            this.body = yield processProfile(data);
        }
    )))
};

let processProfile = profile => co(function *() {
    let imageId = profile.picture;
    profile.picture = yield c('images').findOne({_id: imageId});
    profile.url = `/teacher/${profile.id}`;
    return profile;
});