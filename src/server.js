import path from 'path';
import {Server} from 'http';
import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import convert from 'koa-convert';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import prerender from 'koa-prerender';
import helmet from 'koa-helmet';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';

import config from './config';
import {redirectionTable} from './config';
import {routes, queryObject} from './routes';
import api from './api';
import {redirect} from './routes/redirect';
import {checkAuth} from './core/service';

const dirPublic = path.join(__dirname, '../public');
const dirTemplates = path.join(__dirname, 'templates');

export default function(store){
    const $ = convert;
    
    const app = new Koa();
    app.proxy = true;

    app.use(bodyParser({
        extendTypes: {
            json: 'application/ejson'
        }
    }));
    app.use(logger());
    app.use(apis(store));
    app.use($(conditional()));
    app.use($(etag()));
    app.use(prerenderRmFragment());
    app.use($(prerender(config.prerender)));
    app.use(serve(dirPublic));
    app.use(serve(dirTemplates));
    app.use($(redirect(redirectionTable)));
    app.use($(helmet()));
    app.use(queryObject());
    app.use(routes());

    return Server(app.callback());
}

function apis(store){
    return mount('/api/v1', api(checkAuth, store));
}

function prerenderRmFragment(){
    return async (ctx, next) => {
        await next();

        try {
            let xp = ctx.response.header['x-prerender'] == 'true';
            if (xp) ctx.body = ctx.body.replace('<meta name="fragment" content="!">', '');
        } catch (e) {
        }
    }
}
