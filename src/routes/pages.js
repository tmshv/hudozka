import route from 'koa-route';
import {c} from '../core/db';
import {accepts, index} from './';

async function exists(ctx) {
	const page = await getPage(ctx.path);
	return Boolean(page);
}

async function getPage(path) {
	return await c('pages').findOne({url: path});
}

export default function () {
	return route.get('*', accepts({
		'text/html': index(exists),
		'text/plain': index(exists),
		'application/json': async(ctx) => {
			const page = await getPage(ctx.path);
			if (!page) ctx.status = 404;
			else ctx.body = page;
		}
	}))
};
