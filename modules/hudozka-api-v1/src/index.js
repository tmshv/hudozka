import {add as timelineAdd} from './api/timeline';
import compose from 'koa-compose';

export default function (auth, data) {
    return compose([
        timelineAdd(auth, data)
    ]);
};
