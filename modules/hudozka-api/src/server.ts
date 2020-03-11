import { config } from 'dotenv'
import express from 'express'
import { connect } from './db'
import * as file from './controllers/file'
import * as page from './controllers/page'
import * as image from './controllers/image'
import * as tag from './controllers/tag'

async function main() {
    const port = process.env.PORT || '3000'
    const mongoUri = process.env.MONGO_URI

    try {
        await connect('hudozka', mongoUri)

        console.log('connected')
    } catch (e) {
        console.error(e.message)

        process.exit(1)
    }

    const app = express()
    app.get('/files/urls', file.getUrls)
    app.get('/files/:slug', file.getItem)

    app.get('/pages', page.getAll)
    app.get('/pages/urls', page.getUrls)
    app.get('/pages/tags', page.getByTags)
    app.get('/page', page.getItem)

    app.get('/image', image.getItem)

    app.get('/tags', tag.getAll)

    app.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
}

config()
main()
