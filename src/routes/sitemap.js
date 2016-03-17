import sitemap  from 'sitemap';
import route  from 'koa-route';
import {c}  from '../core/db';

import {homeUrl, sitemapCacheTime} from '../config';
import menu from '../models/menu';

export default function (app) {
    app.use(route.get('/sitemap.xml', function *() {
        let urls = yield [
            getMenuUrls(),
            getGalleryUrls(),
            getTeacherUrls(),
            getEventsUrls(),
            getNewsUrls()
        ];
        urls = urls.reduce((urls, i) => urls.concat(i));

        let sm = sitemap.createSitemap({
            hostname: homeUrl,
            cacheTime: sitemapCacheTime,
            urls: urls
        });

        this.set('Content-Type', 'application/xml');
        this.body = yield new Promise(resolve => sm.toXML(resolve));
    }));
};

function *getMenuUrls() {
    return menu
        .filter(i => 'url' in i)
        .map(function (item) {
            return {
                url: item.url,
                changefreq: 'daily'
            }
        });
}

function *getGalleryUrls() {
    let docs = yield c('albums')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/album/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

function *getTeacherUrls() {
    let docs = yield c('collective')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/teacher/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

function *getEventsUrls() {
    let docs = yield c('events')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/article/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

function *getNewsUrls() {
    let docs = yield c('timeline')
        .find({type: 'post'})
        .toArray();

    return docs.map(i => {
        return {
            url: `/article/${i.id}`,
            changefreq: 'monthly'
        }
    });
}
