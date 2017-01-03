import {readFile} from 'async-file';
import handlebars from 'handlebars';
import route from 'koa-route';
import compose from 'koa-compose';

import {map, assign} from '../utils/common';
import {index as indexFile} from '../config';

import sitemap from './sitemap';
import schedule from './schedule';
import {getPageUrls} from '../core/pages';
import news from './news';
import gallery from './gallery';
import error404 from './404';
import documents from './documents';
import teachers from './teachers';
import events from './events';
import articles from './articles';
import pages from './pages';

let main = () => route.get('/', index());

export function routes(store) {
	return compose([
		main(),
		sitemap(),
		schedule(),
		news(),
		gallery(),
		documents(store),
		teachers(),
		events(),
		articles(),
		pages(),
		error404()
	]);
}

export function queryObject() {
	let toTrue = map(true, i => i === 'true');
	let toFalse = map(false, i => i === 'false');
	const processors = [toTrue, toFalse];

	return async(ctx, next) => {
		let query = ctx.query;
		ctx.query = Object
			.keys(query)
			.reduce((query, key) => assign(
				query,
				key,
				processors
					.reduce((value, fn) => fn(value), query[key])
			), query);

		await next();
	}
}

export function accepts(routes) {
	return async function (ctx) {
		let request = ctx.request;
		let types = Object.keys(routes)
			.filter(type => request.accepts(type));

		if (types.length) {
			let fn = routes[types[0]];

			await fn.apply(ctx, arguments);
		} else {
			ctx.status = 406;
		}
	};
}

export function index(fn) {
	return async function (ctx) {
		let test = true;
		if (fn) test = await fn.apply(ctx, arguments);
		if (!test) ctx.status = 404;

		const data = await getInitialData();
		const source = await readFile(indexFile, 'utf-8');
		const template = handlebars.compile(source);

		ctx.type = 'text/html';
		ctx.body = template({data: JSON.stringify(data)});
	}
}

export function json(fn) {
	return accepts({
		'text/html': index(),
		'text/plain': index(),
		'application/json': fn
	});
}

async function getInitialData() {
	const pages = await getPageUrls();
	return {pages: pages};
}
