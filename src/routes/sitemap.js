import sitemap  from 'sitemap';
import route  from 'koa-route';
import {c}  from '../core/db';

import {homeUrl, sitemapCacheTime} from '../config';
import menu from '../models/menu';

export default function () {
    return route.get('/sitemap.xml', async ctx => {
        let urls = await Promise.all([
            getMenuUrls(),
            getGalleryUrls(),
            getTeacherUrls(),
            getEventsUrls(),
            getNewsUrls()
        ]);
        urls = urls.reduce((urls, i) => urls.concat(i));

        let map = sitemap.createSitemap({
            hostname: homeUrl,
            cacheTime: sitemapCacheTime,
            urls: urls
        });

        ctx.set('Content-Type', 'application/xml');
        ctx.body = map.toString();
    })
};

async function getMenuUrls(frequency='daily') {
    return menu
        .filter(i => 'url' in i)
        .map(i => ({
            url: i.url,
            changefreq: frequency
        }));
}

async function getGalleryUrls() {
    let docs = await c('albums')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/album/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

async function getTeacherUrls() {
    let docs = await c('collective')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/teacher/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

async function getEventsUrls() {
    let docs = await c('events')
        .find({})
        .toArray();

    return docs.map(i => {
        return {
            url: `/article/${i.id}`,
            changefreq: 'monthly'
        }
    });
}

async function getNewsUrls() {
    let docs = await c('timeline')
        .find({type: 'post'})
        .toArray();

    return docs.map(i => {
        return {
            url: `/article/${i.id}`,
            changefreq: 'monthly'
        }
    });
}
