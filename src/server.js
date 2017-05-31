import path from 'path'
import {Server} from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import logger from 'koa-logger'
import convert from 'koa-convert'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import helmet from 'koa-helmet'
import mount from 'koa-mount'
import cookie from 'koa-cookie'
import session from 'koa-session'
import bodyParser from 'koa-bodyparser'

import apiV1 from 'hudozka-api-v1'
import {redirectionTable} from './config'
import {queryObject} from './routes'
import {redirect} from './routes/redirect'
import {services as serviceKeys, authChecker} from './core/service'
import handlebars from 'handlebars'

const config = require('./config')
const error = require('./middlewares/error')
const home = require('./routes/home')
const article = require('./routes/articles')
const albums = require('./routes/albums')
const gallery = require('./routes/gallery')
const teachers = require('./routes/teachers')
const documents = require('./routes/documents')
const document = require('./routes/document')
const schedule = require('./routes/schedule')
const pages = require('./routes/pages')
const sitemap = require('./routes/sitemap')

const dirPublic = path.join(__dirname, '../public')

handlebars.registerHelper('raw-helper', options => options.fn())

const collectiveOrder = [
	'mg-timasheva',
	'va-sarzhin',
	'od-gogoleva',
	'my-valkova',
	'vv-voronova',
	'nv-andreeva',
]

const sessionConfig = {
	key: 'sid', /** (string) cookie key */
	maxAge: 86400000, /** (number) maxAge in ms */
	overwrite: false, /** (boolean) can overwrite or not */
	httpOnly: false, /** (boolean) httpOnly or not */
	signed: true, /** (boolean) signed or not  */
}

export default function (store) {
	const $ = convert

	const app = new Koa()
	app.keys = ['1234']
	app.proxy = true

	app.use(bodyParser({
		extendTypes: {
			json: 'application/ejson'
		}
	}))
	app.use(logger())
	app.use(apis(store))
	app.use(convert(session(sessionConfig, app)))
	app.use(cookie())
	app.use($(conditional()))
	app.use($(etag()))
	app.use(serve(dirPublic))
	app.use($(redirect(redirectionTable)))
	app.use($(helmet()))
	app.use(queryObject())

	app.use(async (ctx, next) => {
		if (ctx.session.isNew) {
			ctx.session.startDate = new Date()
		}

		await next()
	})

	app.use(error.notFound(config.view404))
	app.use(sitemap())

	app.use(home.getHome(5))
	app.use(gallery.getGallery())
	app.use(article.getArticles(5))
	app.use(article.getArticle())
	app.use(albums.getAlbum())
	app.use(teachers.getCollective(collectiveOrder))
	app.use(teachers.getTeacher())
	app.use(documents.getDocuments())
	app.use(document.getDocument())
	app.use(schedule.getSchedule())
	app.use(pages())

	return Server(app.callback())
}

function apis(store) {
	let checkAuth = authChecker(serviceKeys)
	return mount('/api/v1', apiV1(checkAuth, store))
}
