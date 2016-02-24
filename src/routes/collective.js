import route from 'koa-route';
import {index, json} from './';
import db from '../core/db';
import {getCourseNameByID} from '../models/course';
import team from '../models/team';

export default function (app) {
    app.use(
        route.get('/collective', json(
            function *() {
                this.type = 'application/json';

                let data = yield db.c('collective').find();
                if (!data) {
                    this.status = 404;
                    return;
                }

                this.body = data;
            }
        ))
    );
};
