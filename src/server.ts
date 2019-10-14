import Koa from 'koa'
import next from 'next'
import { get } from 'koa-route'
import { connect } from './core/db'
import Page from './core/Page'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT, 10) || 3000

app.prepare().then(async () => {
    try {
        await connect()
    } catch (e) {
        console.error(e.message)

        process.exit(1)
    }

    const pages = await Page.find({})
    const pagesUrls = pages.map(x => x.url)

    const server = new Koa()
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })

    server.use(get('*', async ctx => {
        const url = ctx.req.url

        if (pagesUrls.includes(url)) {
            await app.render(ctx.req, ctx.res, '/next', ctx.query)
        } else {
            await handle(ctx.req, ctx.res)
        }

        ctx.respond = false
    }))

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})
