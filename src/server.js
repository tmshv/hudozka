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
import bodyParser from 'koa-bodyparser'

import apiV1 from 'hudozka-api-v1'
import {redirectionTable} from './config'
import {routes, queryObject} from './routes'
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

const dirPublic = path.join(__dirname, '../public')
const dirTemplates = path.join(__dirname, 'templates')

handlebars.registerHelper('raw-helper', options => options.fn())

const collectiveOrder = [
	'mg-timasheva',
	'va-sarzhin',
	'od-gogoleva',
	'my-valkova',
	'vv-voronova',
	'nv-andreeva',
]

export default function (store) {
	const $ = convert

	const app = new Koa()
	app.proxy = true

	app.use(bodyParser({
		extendTypes: {
			json: 'application/ejson'
		}
	}))
	app.use(logger())
	app.use(apis(store))
	app.use(cookie())
	app.use($(conditional()))
	app.use($(etag()))
	app.use(serve(dirPublic))
	app.use(serve(dirTemplates))
	app.use($(redirect(redirectionTable)))
	app.use($(helmet()))
	app.use(queryObject())

	app.use(error.notFound(config.view404))
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
	app.use(routes(store))

	return Server(app.callback())
}

function apis(store) {
	let checkAuth = authChecker(serviceKeys)
	return mount('/api/v1', apiV1(checkAuth, store))
}
