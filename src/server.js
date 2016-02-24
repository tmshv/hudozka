import path from 'path';
import koa from 'koa.io';
import route from 'koa-route';
import serve from 'koa-static';
import logger from 'koa-logger';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import prerender from 'koa-prerender';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';

import config from './config';
import {index, queryObject} from './routes';

import sitemap from './routes/sitemap';
import schedule from './routes/schedule';
import news from './routes/news';
import gallery from './routes/gallery';
import instagram from './instagram/router';
import instagramIO from './instagram/io';
import error404 from './routes/404';
import documents from './routes/documents';
import collective from './routes/collective';

export const app = koa();
app.proxy = true;

app.use(bodyParser());
app.use(logger());
app.use(conditional());
app.use(etag());

app.use(function *(next) {
    yield* next;

    try {
        let xp = this.response.header['x-prerender'] == 'true';
        if (xp) this.body = this.body.replace('<meta name="fragment" content="!">', '');
    } catch (e) {
    }
});
app.use(prerender(config.prerender));
app.use(serve(path.join(__dirname, '../public')));
app.use(serve(path.join(__dirname, 'templates')));
app.use(helmet());
app.use(queryObject());
app.use(route.get('/', index()));

sitemap(app);
schedule(app);
news(app);
gallery(app);
instagram(app);
instagramIO(app);
documents(app);
collective(app);
app.use(error404());