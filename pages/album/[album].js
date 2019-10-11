import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import App from '../../src/components/App'
import Article from '../../src/components/Article'
import Html from '../../src/components/Html'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { createApiUrl } from '../../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.album.title}</title>
        </Head>
        <div className="content content_thin">
            <Article
                title={props.album.title}
                date={props.album.date}
                shareable={true}
            >
                <Html
                    html={props.album.post}
                />
            </Article>
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = '/gallery'
    const id = ctx.query.album
    const res = await axios.get(createApiUrl(ctx.req, `/api/albums/${id}`))
    const album = res.data

    return {
        album,
        pageUrl,
    }
}

export default Page