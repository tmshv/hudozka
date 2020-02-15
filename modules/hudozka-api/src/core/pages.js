import {c} from '../core/db';

const PAGES = 'pages';

export async function getPageUrls() {
	return await c(PAGES)
		.find({}, {url: 1})
		.toArray();
}

/**
 * Find a person by it's id
 *
 * @param {string} url
 * @returns {Promise|*}
 */
export async function getPage(url) {
	return await c(PAGES).findOne({url: url});
}
