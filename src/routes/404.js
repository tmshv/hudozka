import {index, accepts} from './';

export default function () {
    return async(ctx) => {
        if (ctx.status != 404) return;

        ctx.status = 404;
        ctx.body = 'lol found';

        await accepts({
            'text/html': index(),
            'text/plain': async ctx => {
                ctx.type = 'text/plain';
                ctx.body = 'Page not found';
            },

            'application/json': async ctx => {
                ctx.type = 'application/json';
                ctx.body = {
                    error: 404,
                    message: 'Not Found'
                };
            }
        })(ctx);
    };
};