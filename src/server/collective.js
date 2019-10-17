const { collection } = require('../core/db')
// import { collection } from '../core/db'

export async function getCollective(query = {}) {
    return await collection('collective')
        .find(query)
        .toArray();
}

/**
 * Find a person by it's id
 *
 * @param id
 * @returns {Promise|*}
 */
export async function getPerson(id) {
    return await collection('collective').findOne({ id: id });
}
