import sitemap from 'sitemap';
import route from 'koa-route';
import {c} from '../core/db';
import {getPageUrls as pages} from '../core/pages';

import {homeUrl, sitemapCacheTime} from '../config';
import menu from '../models/menu';

export default function () {
	return route.get('/sitemap.xml', async ctx => {
		let urls = await Promise.all([
			getMenuUrls(),
			getPageUrls(),
			getGalleryUrls(),
			getTeacherUrls(),
			getArticleUrls(),
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

async function getMenuUrls(frequency = 'daily') {
	return menu
		.filter(i => 'url' in i)
		.map(i => ({
			url: i.url,
			changefreq: frequency
		}));
}

async function getPageUrls(frequency = 'daily') {
	const ps = await pages();
	return ps.map(i => ({
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

async function getArticleUrls() {
	let docs = await c('articles')
		.find({})
		.toArray();

	return docs.map(i => {
		return {
			url: `/article/${i.id}`,
			changefreq: 'monthly'
		}
	});
}
