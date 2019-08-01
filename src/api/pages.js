const { get } = require('koa-route')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash

const Page = require('../core/Page')

function getPage() {
    return get('/api/pages/*', async ctx => {
        const path = getPathWithNoTrailingSlash(ctx.path)
        const pagePath = path.replace('/api/pages', '')

        const resource = await Page.findByUrl(pagePath)
        if (!resource) {
            ctx.status = 404
            ctx.body = {
                error: 'not found'
            }
        } else {
            ctx.body = {
                id: resource.id,
                title: resource.title,
                url: resource.url,
                data: resource.data,
                preview: resource.preview,
            }
        }
    })
}

exports.getPage = getPage
