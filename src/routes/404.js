import {index, accepts} from './';

export default function () {
    return function *(next) {
        yield next;

        if (404 != this.status) return;

        this.status = 404;
        yield accepts({
            'text/html': index(),

            'text/plain': function *() {
                this.type = 'text/plain';
                this.body = 'Page not found';
            },

            'application/json': function *() {
                this.type = 'application/json';
                this.body = {
                    message: 'Not Found'
                };
            }
        });
    };
};