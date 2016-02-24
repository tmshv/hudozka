import path from 'path';
import fs from 'mz/fs';
import config from '../config';

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

export let json = fn => accepts({
    'text/html': index(),
    'text/plain': index(),
    'application/json': fn
});