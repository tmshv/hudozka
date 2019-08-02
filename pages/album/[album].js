import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import App from '../../src/components/App'
import Article from '../../src/components/Article'
import Html from '../../src/components/Html'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'

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
    const apiUrl = `http://localhost:3000/api/albums/${id}`
    const res = await axios.get(apiUrl)
    const album = res.data

    return {
        album,
        pageUrl,
    }
}

export default Page