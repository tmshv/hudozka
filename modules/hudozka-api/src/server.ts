import { config } from 'dotenv'
import express from 'express'
import { connect } from './db'
import * as person from './controllers/person'
import * as article from './controllers/article'
import * as album from './controllers/album'
import * as schedule from './controllers/schedule'
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
    app.get('/persons', person.getAll)
    app.get('/persons/urls', person.getUrls)
    app.get('/persons/:slug', person.getItem)

    app.get('/articles', article.getAll)
    app.get('/articles/urls', article.getUrls)
    app.get('/articles/:slug', article.getItem)

    app.get('/albums', album.getAll)
    app.get('/albums/urls', album.getUrls)
    app.get('/albums/:slug', album.getItem)

    app.get('/files', file.getAll)
    app.get('/files/urls', file.getUrls)
    app.get('/files/:slug', file.getItem)

    app.get('/pages', page.getAll)
    app.get('/pages/urls', page.getUrls)
    app.get('/page', page.getItem)

    app.get('/images/:slug', image.getItem)

    app.get('/schedule', schedule.getItem)
    app.get('/tags', tag.getAll)
    app.get('/tags/:slug', tag.findItems)

    app.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
}

config()
main()
