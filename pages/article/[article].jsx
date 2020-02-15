import React from 'react'
import Head from 'next/head'
import { get } from 'lodash'
import { App } from '../../src/components/App'
import Article from '../../src/components/Article'
import Html from '../../src/components/Html'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { Meta } from '../../src/components/Meta'
import { meta } from '../../src/lib/meta'
import { createApiUrl, requestGet, wrapInitialProps } from '../../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
        layout={'thin'}
    >
        <Head>
            <title>{props.article.title}</title>
            <Meta meta={props.meta} />
        </Head>
        <Article
            title={props.article.title}
            date={props.article.date}
            tags={props.article.tags}
            shareable={true}
        >
            <Html
                html={props.article.post}
            />
        </Article>
    </App>
)

Page.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = '/'
    const id = ctx.query.article
    const article = await requestGet(createApiUrl(`/api/articles/${id}`), {})
    const image = get(article, 'preview.artifacts.fb', {})

    return {
        article,
        pageUrl,
        meta: meta({
            title: article.title,
            image: image.src,
            imageWidth: image.width,
            imageHeight: image.height,
        }),
    }
})

export default Page