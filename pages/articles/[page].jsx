import React from 'react'
import axios from 'axios'
import App from '../../src/components/App'
import ArticleCardList from '../../src/components/ArticleCardList'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'

function getMeta(article) {
    return {
        title: article.title,
    }
}

// async function renderHome(path, pageSize) {
//     return render(path, Component, getMeta({ title: 'Шлиссельбургская ДХШ' }), { showAuthor: true })
// }

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <div className="content content_wide">
            <ArticleCardList
                articles={props.articles}
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = '/'
    const page = parseInt(ctx.query.page)
    const pageSize = parseInt(ctx.query.pageSize)
    const apiUrl = `http://localhost:3000/api/articles?page=${page}&pageSize=${pageSize}`
    const res = await axios.get(apiUrl)
    const articles = res.data.items
    const nextPage = res.data.nextPage
    const prevPage = res.data.prevPage

    return {
        articles,
        nextPage,
        prevPage,
        pageUrl,
    }
}

export default Page