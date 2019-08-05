import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { App } from '../src/components/App'
import Page from '../src/components/Page'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { Meta } from '../src/components/Meta'
import { meta } from '../src/lib/meta'

const Index = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >   
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <div className={'content content_thin'}>
            <Page
                shareable={true}
            >
                {props.content}
            </Page>
        </div>
    </App>
)

Index.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    // // const pageUrl = '/neighbors/2018'
    const apiUrl = `http://localhost:3000/api/page?page=${pageUrl}`
    const res = await axios.get(apiUrl)
    const page = res.data
    const image = page.preview.artifacts.fb

    return {
        content: page.data,
        pageUrl,
        title: page.title,
        meta: meta({
            title: page.title,
            image: image.src,
            imageWidth: image.width,
            imageHeight: image.height,
        }),
    }
}

export default Index