import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { App } from '../../src/components/App'
import Article from '../../src/components/Article'
import Html from '../../src/components/Html'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { Meta } from '../../src/components/Meta'
import { meta } from '../../src/lib/meta'
import { createApiUrl } from '../../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.article.title}</title>
            <Meta meta={props.meta} />
        </Head>
        <div className={'content content_thin'}>
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
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = '/'
    const id = ctx.query.article
    const res = await axios.get(createApiUrl(ctx.req, `/api/articles/${id}`))
    const article = res.data
    const image = article.preview.artifacts.fb

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
}

export default Page