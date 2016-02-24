import path from 'path';
import fs from 'mz/fs';
import config from '../config';

export function queryObject(){
    let assign = (dict, key, value) => {
        dict[key] = value;
        return dict;
    };
    let map = (v, fn) =>
        value => fn(value) ? v : value;

    let toTrue = map(true, i => i === 'true');
    let toFalse = map(false, i => i === 'false');
    const processors = [toTrue, toFalse];

    return function *(next) {
        let query = this.query;
        this.query = Object.keys(query)
            .reduce((query, key) => assign(
                query,
                key,
                processors
                    .reduce((value, fn) => fn(value), query[key])
            ), query);

        yield next;
    }
}

export function accepts(routes, def) {
    return function *() {
        let req = this.request;
        let types = Object.keys(routes)
            .filter(type => req.accepts(type));

        if (types.length) {
            let type = types[0];
            yield routes[type].apply(this, arguments);
        } else if (def) {
            yield def;
        } else {
            this.status = 406;
        }
    };
}

export function index(filename) {
    if (!filename) filename = config['defaultIndex'];

    return function *() {
        this.type = 'text/html';
        this.body = fs.createReadStream(filename);
    }
}

export const json = fn => accepts({
    'text/html': index(),
    'text/plain': index(),
    'application/json': fn
});