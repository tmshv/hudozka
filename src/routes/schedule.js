import compose from 'koa-compose';
import co from 'co';
import route from 'koa-route';
import {json} from './';

import {getSchedule, getScheduleList, populateSchedule} from '../core/schedule';

export default function () {
    return compose([
        list(),
        schedule()
    ]);
};

function list() {
    return route.get('/schedule/list', json(
        async(ctx) => {
            ctx.type = 'application/json';
            let data = await getScheduleList();
            if (!data) ctx.status = 404;
            else ctx.body = data;
        }
    ))
}

function schedule() {
    return route.get('/schedule/:period?/:semester?', json(
        async(ctx, period, semester) => {
            ctx.type = 'application/json';

            let data = await getSchedule(period, semester);
            if (!data) {
                ctx.status = 404;
                return;
            }

            let doPopulate = ctx.query.populate || false;
            if (doPopulate) {
                data.schedule = await populateSchedule(data.schedule);
            }

            ctx.body = data;
        }
    ))
}