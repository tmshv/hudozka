import route from 'koa-route';
import {index, json} from './';
import {sortByPattern} from '../utils/sort';
import db from '../core/db';

let split = d => s => s.split(d);
let toArray = split(',');

export default function () {
    return route.get('/collective', json(
        function *() {
            this.type = 'application/json';
            let pattern = toArray(this.query.sort || '');

            let data = yield db.c('collective').find();
            if (!data) {
                this.status = 404;
                return;
            }

            this.body = sortByPattern(data, pattern, i => i.id);
        }
    ))
};
