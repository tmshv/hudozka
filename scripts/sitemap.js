const sitemap = require('sitemap')
const axios = require('axios')
const fs = require('fs').promises
const homeUrl = 'https://art.shlisselburg.org'
const sitemapCacheTime = 600000

const api = axios.create({
    baseURL: 'https://api.tmshv.com/hudozka',
})

async function getMenuUrls(frequency = 'daily') {
    const menu = [
        '/',
        '/collective',
    ]
    return menu
        // .filter(i => 'url' in i)
        .map(url => ({
            url,
            changefreq: frequency
        }))
}

async function getPageUrls(frequency = 'daily') {
    const res = await api.get('/api/pages/urls')

    return res.data.items.map(url => ({
        changefreq: frequency,
        url,
    }))
}

(async () => {
    let urls = await Promise.all([
        getMenuUrls(),
        getPageUrls(),
    ])
    urls = urls.reduce((urls, i) => urls.concat(i))

    let map = sitemap.createSitemap({
        hostname: homeUrl,
        cacheTime: sitemapCacheTime,
        urls
    })
    const content = map.toString()

    await fs.writeFile('dist/sitemap.xml', content, { encoding: 'utf-8' })
})()