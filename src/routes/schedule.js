import route from 'koa-route';
import {json} from './';

import {getSchedule, getScheduleList, populateSchedule} from '../core/schedule';

export default function (app) {
    app.use(
        route.get('/schedule/list', json(
            function *() {
                this.type = 'application/json';
                let data = yield getScheduleList();
                if (!data) this.status = 404;
                else this.body = data;
            }
        ))
    );

    app.use(
        route.get('/schedule/:period?/:semester?', json(
            function *(period, semester) {
                this.type = 'application/json';

                let data = yield getSchedule(period, semester);
                if (!data) {
                    this.status = 404;
                    return;
                }

                let doPopulate = this.query.populate || false;
                if (doPopulate) {
                    data.schedule = yield populateSchedule(data.schedule);
                }

                this.body = data;
            }
        ))
    );
};
