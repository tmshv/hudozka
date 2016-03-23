import path from 'path';
import koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import prerender from 'koa-prerender';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';

import config from './config';
import {redirectionTable} from './config';
import {routes, queryObject} from './routes';
import api from './routes/api';
import {redirect} from './routes/redirect';

const dirPublic = path.join(__dirname, '../public');
const dirTemplates = path.join(__dirname, 'templates');

export function server(){
    const app = koa();
    app.proxy = true;

    app.use(bodyParser());
    app.use(logger());
    api(app);
    app.use(conditional());
    app.use(etag());
    app.use(prerenderRmFragment());
    app.use(prerender(config.prerender));
    app.use(serve(dirPublic));
    app.use(serve(dirTemplates));
    app.use(redirect(redirectionTable));
    app.use(helmet());
    app.use(queryObject());
    routes(app);
    
    return app;
}

function prerenderRmFragment(){
    return function *(next) {
        yield* next;

        try {
            let xp = this.response.header['x-prerender'] == 'true';
            if (xp) this.body = this.body.replace('<meta name="fragment" content="!">', '');
        } catch (e) {
        }
    }
}