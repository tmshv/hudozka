import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import App from '../src/components/App'
import ArticleCardList from '../src/components/ArticleCardList'
import HudozkaTitle from '../src/components/HudozkaTitle'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
        </Head>

        <div className="content content_wide">
            <HudozkaTitle />

            <ArticleCardList
                articles={props.articles}
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const page = 1
    const pageSize = ctx.query.pageSize
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
        title: 'Шлиссельбургская ДХШ',
    }
}

export default Page