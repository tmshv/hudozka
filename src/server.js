import path from 'path'
import {Server} from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import logger from 'koa-logger'
import convert from 'koa-convert'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import helmet from 'koa-helmet'
import cookie from 'koa-cookie'
import session from 'koa-session'
import bodyParser from 'koa-bodyparser'

import {queryObject} from './routes'
import handlebars from 'handlebars'

const {sessionConfig, view404} = require('./config')
const error = require('./middlewares/error')
const redirect = require('./middlewares/redirect')
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
const edit = require('./routes/edit')

const dirPublic = path.join(__dirname, '../public')

handlebars.registerHelper('raw-helper', options => options.fn())

export default function (config) {
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
	app.use(convert(session(sessionConfig, app)))
	app.use(cookie())
	app.use($(conditional()))
	app.use($(etag()))
	app.use(serve(dirPublic))
	app.use(redirect(config.redirect))
	app.use($(helmet()))
	app.use(queryObject())

	app.use(async (ctx, next) => {
		if (ctx.session.isNew) {
			ctx.session.startDate = new Date()
		}

		await next()
	})

	app.use(error.notFound(view404))
	app.use(sitemap())

	// app.use(edit.getEdit())
	app.use(home.getHome(config.articlesPerPage))
	app.use(gallery.getGallery())
	app.use(article.getArticles(config.articlesPerPage))
	app.use(article.getArticle())
	app.use(albums.getAlbum())
	app.use(teachers.getCollective(config.collectiveOrder))
	app.use(teachers.getTeacher())
	app.use(documents.getDocuments())
	app.use(document.getDocument())
	app.use(schedule.getSchedule())
	app.use(pages())

	return Server(app.callback())
}
