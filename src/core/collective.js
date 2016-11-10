import {c} from '../core/db';

export async function getCollective(query={}) {
    return await c('collective')
        .find(query)
        .toArray();
}

/**
 * Find a person by it's id
 *
 * @param id
 * @returns {Promise|*}
 */
export async function getPerson(id){
    return await c('collective').findOne({id: id});
}
