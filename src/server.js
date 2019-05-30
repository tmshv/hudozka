import path from 'path'
import { createServer } from 'http'
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
import next from 'next'

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

const dirPublic = path.join(__dirname, '../public')

handlebars.registerHelper('raw-helper', options => options.fn())

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

function nextHandler() {
    return async ctx => {
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    }
}

export default async function (config) {
    const $ = convert
    
    await app.prepare()

	const server = new Koa()
	server.keys = ['1234']
	server.proxy = true

	server.use(bodyParser({
		extendTypes: {
			json: 'application/ejson'
		}
	}))
	server.use(logger())
	server.use(convert(session(sessionConfig, server)))
	server.use(cookie())
	server.use($(conditional()))
	server.use($(etag()))
	server.use(serve(dirPublic))
	server.use(redirect(config.redirect))
	server.use($(helmet()))
	server.use(queryObject())

	server.use(async (ctx, next) => {
		if (ctx.session.isNew) {
			ctx.session.startDate = new Date()
		}

		await next()
	})

	server.use(error.notFound(view404))
	server.use(sitemap())

	// server.use(edit.getEdit())
	server.use(home.getHome(config.articlesPerPage))
	server.use(gallery.getGallery())
	server.use(article.getArticles(config.articlesPerPage))
	server.use(article.getArticle())
	server.use(albums.getAlbum())
	server.use(teachers.getCollective(config.collectiveOrder))
	server.use(teachers.getTeacher())
	server.use(documents.getDocuments())
	server.use(document.getDocument())
	server.use(schedule.getSchedule())
    server.use(pages(nextHandler()))

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })

    return createServer(server.callback())
}
