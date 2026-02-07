const { Feed } = require("feed")
const axios = require("axios")
const fs = require("fs").promises

const api = axios.create({
    baseURL: "https://api.tmshv.com/hudozka",
})

async function getArticles(limit) {
    const query = ["post", "event", "album"]
        .map(t => `tag=${t}`)
        .join("&")
    const url = `/api/pages/tags?${query}&sortBy=-date&skip=0&pageSize=${limit}`
    const res = await api.get(url)

    return res.data.items
}

(async () => {
    const articles = await getArticles(30)

    const url = "https://art.shlisselburg.org"
    const feed = new Feed({
        title: "Шлиссельбургская ДХШ",
        id: url,
        link: url,
        feedLinks: {
            atom: "https://art.shlisselburg.org/feed.xml",
        },
    })

    articles.forEach(article => {
        feed.addItem({
            title: article.title,
            date: new Date(article.date),
            id: article.id,
            link: article.url,
            content: article.data,
        })
    })

    const content = feed.atom1()    

    await fs.writeFile("dist/feed.xml", content, { encoding: "utf-8" })
})()
 
