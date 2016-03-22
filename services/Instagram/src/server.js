import Koa from 'koa';
import serve from 'koa-static';
import convert from 'koa-convert';
import sessionStore from 'koa-session-store';
import store from 'koa-session-mongo';
import bodyParser from 'koa-bodyparser';

import {db} from './core/db';
import instagram from './middlewares/instagram';
import {routers, statelessRouters} from './routers';
import {sessionSecret, sessionExpirationTime} from './config';

export default function(){
    const app = new Koa();
    app.proxy = true;
    app.keys = [sessionSecret];

    app.use(convert(serve('../build')));
    app.use(bodyParser());
    app.use(statelessRouters());
    app.use(session('sid', sessionExpirationTime));
    app.use(instagram());
    app.use(routers());
    app.use(error());

    return app;
}

function session(name, exp){
    return convert(sessionStore({
        name: name,
        expirationTime: exp,
        store: store.create({
            db: db,
            collection: 'sessions'
        })
    }))
}

function error(){
    return ctx => {
        ctx.status = 404;
        ctx.body = `Document ${ctx.path} not found`;
    };
}
