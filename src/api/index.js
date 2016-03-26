import {add as feedAdd} from './feed';
import compose from 'koa-compose';

export default function (auth, store) {
    return compose([
        feedAdd(auth, store)
    ]);
};
