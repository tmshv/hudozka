import React from 'react'
import Head from 'next/head'
import { App } from '../../src/components/App'
import { ArticleCardList } from '../../src/components/ArticleCardList'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { meta } from '../../src/lib/meta'
import { Meta } from '../../src/components/Meta'
import { createApiUrl, requestGet, wrapInitialProps } from '../../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
        layout={'wide'}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>
        <ArticleCardList
            articles={props.articles}
            prevPage={props.prevPage}
            nextPage={props.nextPage}
        />
    </App>
)

Page.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = '/'
    const page = parseInt(ctx.query.page)
    const pageSize = parseInt(ctx.query.pageSize) || 15
    const res = await requestGet(createApiUrl(ctx.req, `/api/articles?page=${page}&pageSize=${pageSize}`), {})
    const articles = res.items || []
    const nextPage = res.nextPage
    const prevPage = res.prevPage
    const title = 'События'

    return {
        articles,
        nextPage,
        prevPage,
        pageUrl,
        title,
        meta: meta({
            title,
        })
    }
})

export default Page
