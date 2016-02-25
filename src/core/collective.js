import {c} from '../core/db';

export function* getCollective(query={}, show={}) {
    let data = yield c('collective').find(query, show);
    if (!data) {
        return null;
    }
    return data;
}