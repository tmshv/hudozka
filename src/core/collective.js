import {c} from '../core/db';

export async function getCollective(query={}, show={}) {
    let data = await c('collective').find(query, show);
    if (!data) {
        return null;
    }
    return data;
}