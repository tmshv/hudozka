import {add as feedAdd} from './feed';
import compose from 'koa-compose';

export default function () {
    return compose([
        feedAdd()
    ]);
};
