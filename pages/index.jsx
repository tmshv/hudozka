import React from 'react'
import Head from 'next/head'
import { App } from '../src/components/App'
import { Meta } from '../src/components/Meta'
import { ArticleCardList } from '../src/components/ArticleCardList'
import { HudozkaTitle } from '../src/components/HudozkaTitle'
import menuModel from '../src/models/menu'
import { meta } from '../src/lib/meta'
import { buildMenu } from '../src/lib/menu'
import { createApiUrl, requestGet } from '../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
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
    const pageUrl = '/'
    const page = 1
    const pageSize = ctx.query.pageSize || 15
    const res = await requestGet(createApiUrl(ctx.req, `/api/articles?page=${page}&pageSize=${pageSize}`), {})
    const articles = res.items
    const nextPage = res.nextPage
    const prevPage = res.prevPage
    const title = 'Шлиссельбургская ДХШ'

    return {
        articles,
        nextPage,
        prevPage,
        pageUrl,
        title,
        meta: meta({
            title,
            url: pageUrl,
        })
    }
}

export default Page